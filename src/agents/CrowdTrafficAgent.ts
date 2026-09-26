import { Pandal, PujaDay, PUJA_DAY_FACTORS } from '../data/kolkataData';
import { AgentLog } from './types';

export interface EvaluatedPandalMetrics {
  pandal: Pandal;
  estimatedWaitMinutes: number;
  viewingMinutes: number;
  crowdLevel: 'Low' | 'Moderate' | 'Heavy' | 'Extreme';
  policeAdvisory?: string;
  recommendedEntryTimeWindow: string;
}

export class CrowdTrafficAgent {
  name = 'Crowd & Traffic Analyst Agent';
  role = 'CROWD_TRAFFIC_ANALYST' as const;

  async analyze(
    pandals: Pandal[],
    pujaDay: PujaDay,
    startTime: string,
    hasVipPass: boolean,
    logCallback: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void
  ): Promise<{ evaluated: EvaluatedPandalMetrics[]; advisories: string[] }> {
    const dayConfig = PUJA_DAY_FACTORS[pujaDay] || PUJA_DAY_FACTORS['Panchami'];

    logCallback({
      agent: this.role,
      agentName: this.name,
      type: 'thought',
      content: `Applying predictive temporal models for ${pujaDay}. Base crowd multiplier: ${dayConfig.crowdMultiplier}x | Road Congestion: ${dayConfig.trafficCongestion} | Kolkata Police alert level: ${dayConfig.policeRestrictionLevel}.`
    });

    const advisories: string[] = [];
    if (dayConfig.policeRestrictionLevel === 'Strict' || dayConfig.policeRestrictionLevel === 'High Alert') {
      advisories.push(`Kolkata Police Traffic Advisory: Rashbehari Ave, Gariahat, and VIP Road are strictly pedestrian-priority zones after ${dayConfig.peakFrom}. Private cars & app cabs prohibited on pandal arterials.`);
      advisories.push(`Kolkata Metro running overnight special trains at 6-minute headways.`);
    }

    const startHour = parseInt(startTime.split(':')[0] || '17', 10);

    const evaluated: EvaluatedPandalMetrics[] = pandals.map((p, idx) => {
      // Approximate time of arrival for this stop
      const approxHour = (startHour + Math.floor(idx * 1.2)) % 24;
      const isPeakHour = p.peakHours.some(h => parseInt(h.split(':')[0], 10) === approxHour);

      let wait = p.baseWaitMin * dayConfig.crowdMultiplier;
      if (isPeakHour) {
        wait *= 1.35;
      }

      // VIP pass reduction
      if (hasVipPass && p.vipPassAvailable) {
        wait = Math.max(5, Math.round(wait * 0.25)); // 75% queue reduction
      } else {
        wait = Math.round(wait);
      }

      let crowdLevel: 'Low' | 'Moderate' | 'Heavy' | 'Extreme' = 'Low';
      if (wait > 50) crowdLevel = 'Extreme';
      else if (wait > 30) crowdLevel = 'Heavy';
      else if (wait > 15) crowdLevel = 'Moderate';

      let policeAdvisory: string | undefined;
      if (p.policeCordonZone && (dayConfig.trafficCongestion === 'High' || dayConfig.trafficCongestion === 'Extreme')) {
        policeAdvisory = `Vehicular cordon in effect around ${p.name}. Approach on foot via ${p.entryGate}.`;
      }

      return {
        pandal: p,
        estimatedWaitMinutes: wait,
        viewingMinutes: 15,
        crowdLevel,
        policeAdvisory,
        recommendedEntryTimeWindow: `${approxHour}:00 - ${approxHour + 1}:00`
      };
    });

    logCallback({
      agent: this.role,
      agentName: this.name,
      type: 'observation',
      content: `Calculated dynamic wait times. Highest queue: ${evaluated.reduce((max, e) => e.estimatedWaitMinutes > max.estimatedWaitMinutes ? e : max).pandal.name} (${Math.max(...evaluated.map(e => e.estimatedWaitMinutes))} min).`
    });

    logCallback({
      agent: this.role,
      agentName: this.name,
      type: 'delegation',
      content: `Passing evaluated crowd metrics and traffic cordon data to Multi-Modal Transit Router Agent for multi-objective graph optimization.`
    });

    return { evaluated, advisories };
  }
}
