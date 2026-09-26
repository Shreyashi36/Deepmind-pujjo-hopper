import { Pandal, PujaDay } from '../data/kolkataData';

export type TransitModePreference = 'Fastest' | 'Cheapest (Budget ₹)' | 'Least Walking (Comfort)';

export interface UserPreferences {
  origin: string;
  originLat: number;
  originLng: number;
  destination: string;
  destinationLat: number;
  destinationLng: number;
  pujaDay: PujaDay;
  startTime: string; // e.g. "16:30"
  maxHours: number;
  targetThemes: string[];
  modePreference: TransitModePreference;
  hasVipPass: boolean;
  maxPandals?: number;
}

export type AgentRole = 
  | 'MASTER_ORCHESTRATOR'
  | 'PANDAL_CURATOR'
  | 'CROWD_TRAFFIC_ANALYST'
  | 'TRANSIT_ROUTER'
  | 'DYNAMIC_REPLANNER';

export interface AgentLog {
  id: string;
  timestamp: string;
  agent: AgentRole;
  agentName: string;
  type: 'thought' | 'action' | 'observation' | 'delegation' | 'alert' | 'success';
  content: string;
  metadata?: Record<string, any>;
}

export interface TransitLeg {
  id: string;
  fromName: string;
  toName: string;
  mode: 'WALK' | 'METRO' | 'AUTO' | 'BUS';
  distanceMeters: number;
  durationMinutes: number;
  costInr: number;
  instruction: string;
  fromCoords: [number, number];
  toCoords: [number, number];
  lineColor?: string;
}

export interface ItineraryStop {
  stopOrder: number;
  pandal: Pandal;
  arrivalTime: string;
  departureTime: string;
  estimatedQueueMinutes: number;
  viewingMinutes: number;
  crowdLevel: 'Low' | 'Moderate' | 'Heavy' | 'Extreme';
  transitToNext?: TransitLeg;
  tips: string[];
  alert?: string;
}

export interface RoutePlan {
  id: string;
  pujaDay: PujaDay;
  startTime: string;
  endTime: string;
  totalDurationMinutes: number;
  totalCostInr: number;
  totalWalkMeters: number;
  totalPandalsVisited: number;
  stops: ItineraryStop[];
  initialTransit: TransitLeg;
  finalTransit: TransitLeg;
  summary: string;
  policeAdvisories: string[];
  generatedBy: string;
  agentTraceCount: number;
}

export interface SimulationEvent {
  id: string;
  title: string;
  pandalId?: string;
  type: 'QUEUE_SURGE' | 'ROAD_CORDON' | 'METRO_DELAY' | 'HEAVY_RAIN';
  description: string;
  severity: 'Warning' | 'Critical';
}
