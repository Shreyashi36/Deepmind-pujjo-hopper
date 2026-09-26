import { DURGA_PUJA_PANDALS, Pandal } from '../data/kolkataData';
import { UserPreferences, AgentLog } from './types';

export class PandalCuratorAgent {
  name = 'Pandal Curator Agent';
  role = 'PANDAL_CURATOR' as const;

  // Calculate distance between two lat/lng in km (Haversine formula)
  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async curate(
    prefs: UserPreferences,
    logCallback: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void
  ): Promise<Pandal[]> {
    logCallback({
      agent: this.role,
      agentName: this.name,
      type: 'thought',
      content: `Received user constraints: Day=${prefs.pujaDay}, Start=${prefs.origin}, End=${prefs.destination}, Preference=${prefs.modePreference}, Desired Themes=${prefs.targetThemes.length > 0 ? prefs.targetThemes.join(', ') : 'All Best Themes'}`
    });

    logCallback({
      agent: this.role,
      agentName: this.name,
      type: 'action',
      content: `Scanning database of ${DURGA_PUJA_PANDALS.length} landmark pandals in Kolkata... Filtering geographic corridor and theme alignment.`
    });

    // Determine corridor center and bounding distance
    const originLat = prefs.originLat;
    const originLng = prefs.originLng;
    const destLat = prefs.destinationLat;
    const destLng = prefs.destinationLng;

    const directDistance = this.calculateDistanceKm(originLat, originLng, destLat, destLng);
    const maxRadius = Math.max(directDistance * 1.3, 4.0); // at least 4km search radius

    // Score pandals based on theme relevance, rating, distance to origin/destination corridor
    const scoredPandals = DURGA_PUJA_PANDALS.map(p => {
      const distToOrigin = this.calculateDistanceKm(originLat, originLng, p.lat, p.lng);
      const distToDest = this.calculateDistanceKm(p.lat, p.lng, destLat, destLng);
      const corridorDetour = distToOrigin + distToDest - directDistance;

      let score = p.rating * 20; // 0-100 base score from rating

      // Theme match bonus
      if (prefs.targetThemes.length > 0) {
        if (prefs.targetThemes.includes(p.themeCategory)) {
          score += 25;
        }
      } else {
        score += 10;
      }

      // VIP pass bonus if user holds VIP
      if (prefs.hasVipPass && p.vipPassAvailable) {
        score += 15;
      }

      // Penalty for excessive corridor detour
      score -= Math.max(0, corridorDetour * 8);

      return {
        pandal: p,
        score,
        distToOrigin,
        distToDest,
        corridorDetour
      };
    });

    scoredPandals.sort((a, b) => b.score - a.score);

    const targetCount = prefs.maxPandals || (prefs.maxHours <= 4 ? 4 : prefs.maxHours <= 6 ? 6 : 8);
    const selected = scoredPandals.slice(0, targetCount).map(s => s.pandal);

    logCallback({
      agent: this.role,
      agentName: this.name,
      type: 'observation',
      content: `Selected ${selected.length} high-affinity pandals: ${selected.map(p => p.name).join(', ')}.`
    });

    logCallback({
      agent: this.role,
      agentName: this.name,
      type: 'delegation',
      content: `Handing candidate cluster over to Crowd & Traffic Analyst Agent for day-specific (${prefs.pujaDay}) congestion & queue modeling.`
    });

    return selected;
  }
}
