import fullPandalsJson from './kolkata_durga_puja_2026.json';

export interface Pandal {
  id: string;
  name: string;
  zone: 'North' | 'South' | 'East' | 'Central';
  subZone?: string;
  lat: number;
  lng: number;
  nearestMetro: string;
  metroWalkMin: number;
  nearestAutoStand: string;
  themeCategory: 'Grand Lighting & Architecture' | 'Contemporary Art' | 'Heritage & Traditional' | 'Social Theme' | 'Bonedi Bari';
  rating: number; // 1-5
  baseWaitMin: number;
  peakHours: string[];
  description: string;
  famousFor: string;
  policeCordonZone: boolean;
  vipPassAvailable: boolean;
  entryGate: string;
  exitGate: string;
}

export interface MetroStation {
  id: string;
  name: string;
  line: 'Blue Line (North-South)' | 'Green Line (East-West)' | 'Purple Line';
  lat: number;
  lng: number;
  stationCode: string;
}

export interface AutoRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  fare: number;
  durationMin: number;
  routePolyline?: [number, number][];
}

export type PujaDay = 
  | 'Dwitiya' 
  | 'Tritiya' 
  | 'Chaturthi' 
  | 'Panchami' 
  | 'Sasthi' 
  | 'Saptami' 
  | 'Ashtami' 
  | 'Nabami' 
  | 'Dashami';

export const PUJA_DAY_FACTORS: Record<PujaDay, { crowdMultiplier: number; trafficCongestion: 'Low' | 'Moderate' | 'High' | 'Extreme'; peakFrom: string; policeRestrictionLevel: 'Relaxed' | 'Moderate' | 'Strict' | 'High Alert' }> = {
  'Dwitiya': { crowdMultiplier: 0.35, trafficCongestion: 'Low', peakFrom: '18:00', policeRestrictionLevel: 'Relaxed' },
  'Tritiya': { crowdMultiplier: 0.50, trafficCongestion: 'Low', peakFrom: '17:30', policeRestrictionLevel: 'Relaxed' },
  'Chaturthi': { crowdMultiplier: 0.75, trafficCongestion: 'Moderate', peakFrom: '17:00', policeRestrictionLevel: 'Moderate' },
  'Panchami': { crowdMultiplier: 1.10, trafficCongestion: 'Moderate', peakFrom: '16:30', policeRestrictionLevel: 'Moderate' },
  'Sasthi': { crowdMultiplier: 1.45, trafficCongestion: 'High', peakFrom: '16:00', policeRestrictionLevel: 'Strict' },
  'Saptami': { crowdMultiplier: 1.90, trafficCongestion: 'Extreme', peakFrom: '15:30', policeRestrictionLevel: 'Strict' },
  'Ashtami': { crowdMultiplier: 2.30, trafficCongestion: 'Extreme', peakFrom: '15:00', policeRestrictionLevel: 'High Alert' },
  'Nabami': { crowdMultiplier: 2.20, trafficCongestion: 'Extreme', peakFrom: '15:00', policeRestrictionLevel: 'High Alert' },
  'Dashami': { crowdMultiplier: 1.30, trafficCongestion: 'High', peakFrom: '14:00', policeRestrictionLevel: 'Strict' }
};

export const METRO_STATIONS: MetroStation[] = [
  { id: 'm-dakshineswar', name: 'Dakshineswar', line: 'Blue Line (North-South)', lat: 22.6534, lng: 88.3585, stationCode: 'DKW' },
  { id: 'm-dumdum', name: 'Dum Dum', line: 'Blue Line (North-South)', lat: 22.6214, lng: 88.3934, stationCode: 'DD' },
  { id: 'm-belgachia', name: 'Belgachia', line: 'Blue Line (North-South)', lat: 22.6042, lng: 88.3846, stationCode: 'BLG' },
  { id: 'm-shyambazar', name: 'Shyambazar', line: 'Blue Line (North-South)', lat: 22.6033, lng: 88.3705, stationCode: 'SYB' },
  { id: 'm-sovabazar', name: 'Sovabazar Sutanuti', line: 'Blue Line (North-South)', lat: 22.5974, lng: 88.3644, stationCode: 'SOV' },
  { id: 'm-girish-park', name: 'Girish Park', line: 'Blue Line (North-South)', lat: 22.5857, lng: 88.3601, stationCode: 'GPK' },
  { id: 'm-mg-road', name: 'Mahatma Gandhi Road', line: 'Blue Line (North-South)', lat: 22.5804, lng: 88.3615, stationCode: 'MGR' },
  { id: 'm-central', name: 'Central', line: 'Blue Line (North-South)', lat: 22.5694, lng: 88.3598, stationCode: 'CEN' },
  { id: 'm-chandni', name: 'Chandni Chowk', line: 'Blue Line (North-South)', lat: 22.5645, lng: 88.3562, stationCode: 'CC' },
  { id: 'm-esplanade', name: 'Esplanade (Interchange)', line: 'Blue Line (North-South)', lat: 22.5658, lng: 88.3516, stationCode: 'ESP' },
  { id: 'm-park-street', name: 'Park Street', line: 'Blue Line (North-South)', lat: 22.5517, lng: 88.3519, stationCode: 'PKS' },
  { id: 'm-maidan', name: 'Maidan', line: 'Blue Line (North-South)', lat: 22.5414, lng: 88.3496, stationCode: 'MDN' },
  { id: 'm-rabindra-sadan', name: 'Rabindra Sadan', line: 'Blue Line (North-South)', lat: 22.5369, lng: 88.3478, stationCode: 'RSD' },
  { id: 'm-netaji-bhavan', name: 'Netaji Bhavan', line: 'Blue Line (North-South)', lat: 22.5312, lng: 88.3456, stationCode: 'NBV' },
  { id: 'm-jatin-das', name: 'Jatin Das Park', line: 'Blue Line (North-South)', lat: 22.5222, lng: 88.3468, stationCode: 'JDP' },
  { id: 'm-kalighat', name: 'Kalighat', line: 'Blue Line (North-South)', lat: 22.5168, lng: 88.3471, stationCode: 'KGT' },
  { id: 'm-rabindra-sarobar', name: 'Rabindra Sarobar', line: 'Blue Line (North-South)', lat: 22.5085, lng: 88.3467, stationCode: 'RSR' },
  { id: 'm-mahanayak-uttarn', name: 'Mahanayak Uttam Kumar (Tollygunge)', line: 'Blue Line (North-South)', lat: 22.4988, lng: 88.3461, stationCode: 'TLY' },
  { id: 'm-kavi-subhash', name: 'Kavi Subhash (New Garia)', line: 'Blue Line (North-South)', lat: 22.4716, lng: 88.3972, stationCode: 'KVN' },
  { id: 'm-salt-lake-sec-v', name: 'Salt Lake Sector V', line: 'Green Line (East-West)', lat: 22.5802, lng: 88.4326, stationCode: 'SLV' },
  { id: 'm-karunamoyee', name: 'Karunamoyee', line: 'Green Line (East-West)', lat: 22.5866, lng: 88.4206, stationCode: 'KMY' },
  { id: 'm-sealdah', name: 'Sealdah', line: 'Green Line (East-West)', lat: 22.5684, lng: 88.3712, stationCode: 'SDA' },
  { id: 'm-howrah', name: 'Howrah Railway & Metro', line: 'Green Line (East-West)', lat: 22.5833, lng: 88.3431, stationCode: 'HWH' }
];

export const AUTO_ROUTES: AutoRoute[] = [
  { id: 'a-1', name: 'Gariahat to Kalighat Metro', from: 'Gariahat Pantaloons', to: 'Kalighat Metro Gate 2', fare: 15, durationMin: 7 },
  { id: 'a-2', name: 'Rashbehari to Chetla Agrani', from: 'Rashbehari Crossing', to: 'Chetla Central', fare: 12, durationMin: 6 },
  { id: 'a-3', name: 'Ultadanga to Sreebhumi / Lake Town', from: 'Ultadanga Hudco', to: 'Sreebhumi Clock Tower', fare: 20, durationMin: 12 },
  { id: 'a-4', name: 'Shyambazar to Bagbazar Ghat', from: 'Shyambazar 5-point', to: 'Bagbazar Launch Ghat', fare: 12, durationMin: 5 },
  { id: 'a-5', name: 'Sealdah to Santosh Mitra Sq', from: 'Sealdah Station', to: 'Lebutala Crossing', fare: 12, durationMin: 5 },
  { id: 'a-6', name: 'Karunamoyee to FD Block Salt Lake', from: 'Karunamoyee Hub', to: 'FD Block Park', fare: 15, durationMin: 6 },
  { id: 'a-7', name: 'Hazra to Maddox Square', from: 'Hazra Crossing', to: 'Ritchie Road Corner', fare: 12, durationMin: 5 },
  { id: 'a-8', name: 'Rabindra Sarobar to Suruchi Sangha', from: 'Sarobar Metro', to: 'New Alipore Petrol Pump', fare: 18, durationMin: 10 }
];

export const POPULAR_LOCATIONS = [
  { label: 'Howrah Railway Station (HWH)', lat: 22.5833, lng: 88.3431, zone: 'Central' },
  { label: 'Sealdah Railway Station (SDAH)', lat: 22.5684, lng: 88.3712, zone: 'Central' },
  { label: 'Kolkata Airport (CCU / NSCBI)', lat: 22.6547, lng: 88.4467, zone: 'East' },
  { label: 'Salt Lake Sector V (Tech Hub)', lat: 22.5802, lng: 88.4326, zone: 'East' },
  { label: 'Park Street (Central / Nightlife)', lat: 22.5517, lng: 88.3519, zone: 'Central' },
  { label: 'Gariahat Crossing (South Hub)', lat: 22.5186, lng: 88.3683, zone: 'South' },
  { label: 'Shyambazar 5-Point (North Hub)', lat: 22.6033, lng: 88.3705, zone: 'North' },
  { label: 'New Alipore / Taratala (South West)', lat: 22.5112, lng: 88.3314, zone: 'South' },
  { label: 'Dum Dum Junction', lat: 22.6214, lng: 88.3934, zone: 'North' },
  { label: 'Jadavpur 8B Bus Stand', lat: 22.4988, lng: 88.3716, zone: 'South' }
];

// Full dataset with 379 pandals from all zones
export const DURGA_PUJA_PANDALS: Pandal[] = (fullPandalsJson as unknown) as Pandal[];
