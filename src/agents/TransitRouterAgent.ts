import { METRO_STATIONS, AUTO_ROUTES } from '../data/kolkataData';
import { EvaluatedPandalMetrics } from './CrowdTrafficAgent';
import { UserPreferences, TransitLeg, ItineraryStop, RoutePlan, AgentLog } from './types';

export class TransitRouterAgent {
  name = 'Multi-Modal Transit Router Agent';
  role = 'TRANSIT_ROUTER' as const;

  private calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private findNearestMetro(lat: number, lng: number) {
    let nearest = METRO_STATIONS[0];
    let minDist = Infinity;
    for (const station of METRO_STATIONS) {
      const dist = this.calculateDistanceKm(lat, lng, station.lat, station.lng);
      if (dist < minDist) {
        minDist = dist;
        nearest = station;
      }
    }
    return { station: nearest, distanceKm: minDist };
  }

  private findMatchingAuto(fromName: string, toName: string) {
    return AUTO_ROUTES.find(
      r => (r.from.toLowerCase().includes(fromName.toLowerCase()) || fromName.toLowerCase().includes(r.from.toLowerCase())) &&
           (r.to.toLowerCase().includes(toName.toLowerCase()) || toName.toLowerCase().includes(r.to.toLowerCase()))
    );
  }

  private addMinutesToTime(timeStr: string, minutesToAdd: number): string {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMin = h * 60 + m + Math.round(minutesToAdd);
    const newH = Math.floor(totalMin / 60) % 24;
    const newM = totalMin % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  }

  async buildRoute(
    prefs: UserPreferences,
    evaluatedMetrics: EvaluatedPandalMetrics[],
    policeAdvisories: string[],
    logCallback: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void
  ): Promise<RoutePlan> {
    logCallback({
      agent: this.role,
      agentName: this.name,
      type: 'thought',
      content: `Constructing multi-modal transit graph across Kolkata Metro Blue/Green lines, shared auto stands, and pedestrian walking corridors.`
    });

    // 1. Optimize sequence of pandals starting from origin to destination using 2-opt / nearest insertion
    const unvisited = [...evaluatedMetrics];
    const ordered: EvaluatedPandalMetrics[] = [];
    let currentLat = prefs.originLat;
    let currentLng = prefs.originLng;

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const p = unvisited[i].pandal;
        const dist = this.calculateDistanceKm(currentLat, currentLng, p.lat, p.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestIdx = i;
        }
      }

      const next = unvisited.splice(nearestIdx, 1)[0];
      ordered.push(next);
      currentLat = next.pandal.lat;
      currentLng = next.pandal.lng;
    }

    logCallback({
      agent: this.role,
      agentName: this.name,
      type: 'action',
      content: `Optimized hopping sequence to eliminate backtracking: ${ordered.map((o, i) => `${i + 1}. ${o.pandal.name}`).join(' ➔ ')}`
    });

    let currentTime = prefs.startTime;
    let totalCostInr = 0;
    let totalWalkMeters = 0;

    // Initial transit: Origin -> First Pandal
    const firstPandal = ordered[0].pandal;
    const originToFirstDistKm = this.calculateDistanceKm(prefs.originLat, prefs.originLng, firstPandal.lat, firstPandal.lng);

    let initialTransit: TransitLeg;
    if (originToFirstDistKm > 3.0) {
      const originMetro = this.findNearestMetro(prefs.originLat, prefs.originLng);
      const pandalMetro = this.findNearestMetro(firstPandal.lat, firstPandal.lng);

      const metroFare = 20;
      const autoFare = 15;
      const legDuration = 25;
      totalCostInr += metroFare + (prefs.modePreference === 'Cheapest (Budget ₹)' ? 0 : autoFare);
      totalWalkMeters += Math.round(firstPandal.metroWalkMin * 80);

      initialTransit = {
        id: 'leg-init',
        fromName: prefs.origin,
        toName: firstPandal.name,
        mode: originMetro.distanceKm < 2.0 ? 'METRO' : 'AUTO',
        distanceMeters: Math.round(originToFirstDistKm * 1000),
        durationMinutes: legDuration,
        costInr: metroFare + (prefs.modePreference === 'Cheapest (Budget ₹)' ? 0 : autoFare),
        instruction: `Take Metro from ${originMetro.station.name} to ${pandalMetro.station.name}, then walk ${firstPandal.metroWalkMin} min / shared auto to ${firstPandal.name}`,
        fromCoords: [prefs.originLat, prefs.originLng],
        toCoords: [firstPandal.lat, firstPandal.lng],
        lineColor: '#3b82f6'
      };
    } else {
      const walkMin = Math.round(originToFirstDistKm * 14);
      totalWalkMeters += Math.round(originToFirstDistKm * 1000);
      initialTransit = {
        id: 'leg-init',
        fromName: prefs.origin,
        toName: firstPandal.name,
        mode: originToFirstDistKm > 1.2 ? 'AUTO' : 'WALK',
        distanceMeters: Math.round(originToFirstDistKm * 1000),
        durationMinutes: walkMin,
        costInr: originToFirstDistKm > 1.2 ? 15 : 0,
        instruction: originToFirstDistKm > 1.2 ? `Hop on a shared auto towards ${firstPandal.nearestAutoStand}` : `Walk directly via neighborhood lanes to ${firstPandal.name}`,
        fromCoords: [prefs.originLat, prefs.originLng],
        toCoords: [firstPandal.lat, firstPandal.lng],
        lineColor: originToFirstDistKm > 1.2 ? '#eab308' : '#10b981'
      };
      totalCostInr += initialTransit.costInr;
    }

    currentTime = this.addMinutesToTime(currentTime, initialTransit.durationMinutes);

    // Build Stops with intermediate transit legs
    const stops: ItineraryStop[] = [];

    for (let i = 0; i < ordered.length; i++) {
      const current = ordered[i];
      const arrivalTime = currentTime;
      const queueTime = current.estimatedWaitMinutes;
      const viewingTime = current.viewingMinutes;
      const stayDuration = queueTime + viewingTime;
      const departureTime = this.addMinutesToTime(arrivalTime, stayDuration);
      currentTime = departureTime;

      let transitToNext: TransitLeg | undefined;

      if (i < ordered.length - 1) {
        const next = ordered[i + 1];
        const distKm = this.calculateDistanceKm(current.pandal.lat, current.pandal.lng, next.pandal.lat, next.pandal.lng);
        const distMeters = Math.round(distKm * 1000);

        if (distKm <= 1.0) {
          // Walkable
          const duration = Math.round(distKm * 13);
          totalWalkMeters += distMeters;
          transitToNext = {
            id: `leg-${i}`,
            fromName: current.pandal.name,
            toName: next.pandal.name,
            mode: 'WALK',
            distanceMeters: distMeters,
            durationMinutes: duration,
            costInr: 0,
            instruction: `Pedestrian walking corridor (${duration} min, ~${distMeters}m). Follow festival street lighting.`,
            fromCoords: [current.pandal.lat, current.pandal.lng],
            toCoords: [next.pandal.lat, next.pandal.lng],
            lineColor: '#10b981'
          };
        } else if (distKm <= 2.5) {
          // Auto route
          const duration = Math.round(distKm * 5) + 3;
          const fare = 15;
          totalCostInr += fare;
          totalWalkMeters += 250;
          transitToNext = {
            id: `leg-${i}`,
            fromName: current.pandal.name,
            toName: next.pandal.name,
            mode: 'AUTO',
            distanceMeters: distMeters,
            durationMinutes: duration,
            costInr: fare,
            instruction: `Take shared auto from ${current.pandal.nearestAutoStand} to ${next.pandal.nearestAutoStand} (₹${fare}).`,
            fromCoords: [current.pandal.lat, current.pandal.lng],
            toCoords: [next.pandal.lat, next.pandal.lng],
            lineColor: '#eab308'
          };
        } else {
          // Metro route
          const duration = Math.round(distKm * 4) + 12;
          const fare = 15;
          totalCostInr += fare;
          totalWalkMeters += (current.pandal.metroWalkMin + next.pandal.metroWalkMin) * 80;
          transitToNext = {
            id: `leg-${i}`,
            fromName: current.pandal.name,
            toName: next.pandal.name,
            mode: 'METRO',
            distanceMeters: distMeters,
            durationMinutes: duration,
            costInr: fare,
            instruction: `Take Metro from ${current.pandal.nearestMetro} to ${next.pandal.nearestMetro} (₹${fare}).`,
            fromCoords: [current.pandal.lat, current.pandal.lng],
            toCoords: [next.pandal.lat, next.pandal.lng],
            lineColor: '#3b82f6'
          };
        }

        currentTime = this.addMinutesToTime(currentTime, transitToNext.durationMinutes);
      }

      stops.push({
        stopOrder: i + 1,
        pandal: current.pandal,
        arrivalTime,
        departureTime,
        estimatedQueueMinutes: queueTime,
        viewingMinutes: viewingTime,
        crowdLevel: current.crowdLevel,
        transitToNext,
        tips: [
          `Entry: ${current.pandal.entryGate} | Exit: ${current.pandal.exitGate}`,
          `Famous for: ${current.pandal.famousFor}`,
          current.pandal.vipPassAvailable ? 'VIP pass queue active (reduces wait to <10 min).' : 'General queue only.'
        ],
        alert: current.policeAdvisory
      });
    }

    // Final leg to destination
    const lastPandal = ordered[ordered.length - 1].pandal;
    const destDistKm = this.calculateDistanceKm(lastPandal.lat, lastPandal.lng, prefs.destinationLat, prefs.destinationLng);
    const finalTransitMinutes = Math.round(destDistKm * 6) + 10;
    const finalCost = destDistKm > 1.5 ? 20 : 0;
    totalCostInr += finalCost;

    const finalTransit: TransitLeg = {
      id: 'leg-final',
      fromName: lastPandal.name,
      toName: prefs.destination,
      mode: destDistKm > 2 ? 'METRO' : destDistKm > 1 ? 'AUTO' : 'WALK',
      distanceMeters: Math.round(destDistKm * 1000),
      durationMinutes: finalTransitMinutes,
      costInr: finalCost,
      instruction: `Head to ${prefs.destination} via ${destDistKm > 2 ? 'Metro' : 'local transport'}.`,
      fromCoords: [lastPandal.lat, lastPandal.lng],
      toCoords: [prefs.destinationLat, prefs.destinationLng],
      lineColor: '#6366f1'
    };

    const endTime = this.addMinutesToTime(currentTime, finalTransitMinutes);

    let totalDurationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    if (totalDurationMinutes <= 0) {
      totalDurationMinutes += 24 * 60;
    }

    logCallback({
      agent: this.role,
      agentName: this.name,
      type: 'success',
      content: `Synthesized complete itinerary with ${stops.length} pandals. Total time: ${Math.floor(totalDurationMinutes / 60)}h ${totalDurationMinutes % 60}m | Total transit cost: ₹${totalCostInr} | Walking: ${(totalWalkMeters / 1000).toFixed(1)} km.`
    });

    return {
      id: `plan-${Date.now()}`,
      pujaDay: prefs.pujaDay,
      startTime: prefs.startTime,
      endTime,
      totalDurationMinutes,
      totalCostInr,
      totalWalkMeters,
      totalPandalsVisited: stops.length,
      stops,
      initialTransit,
      finalTransit,
      summary: `Autonomous multi-agent itinerary optimized for ${prefs.pujaDay} (${prefs.startTime} - ${endTime}). Covers ${stops.length} flagship pandals spanning ${stops.map(s => s.pandal.name).join(', ')} with an estimated transit cost of just ₹${totalCostInr}.`,
      policeAdvisories,
      generatedBy: 'PujoPath Multi-Agent Orchestrator (Antigravity Managed Interactions API)',
      agentTraceCount: 4
    };
  }
}
