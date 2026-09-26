import React, { useState, useEffect, useMemo } from 'react';
import { 
  DURGA_PUJA_PANDALS, 
  POPULAR_LOCATIONS, 
  PUJA_DAY_FACTORS, 
  PujaDay, 
  Pandal 
} from './data/kolkataData';
import { 
  UserPreferences, 
  TransitModePreference, 
  RoutePlan, 
  AgentLog, 
  SimulationEvent 
} from './agents/types';
import { MasterOrchestrator } from './agents/Orchestrator';
import { MapComponent } from './components/MapComponent';
import { AgentVisualizer } from './components/AgentVisualizer';
import { ItineraryCard } from './components/ItineraryCard';
import { SimulationControls } from './components/SimulationControls';
import { PandalDetailModal } from './components/PandalDetailModal';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Zap, 
  Layers, 
  Compass, 
  Cpu, 
  Ticket, 
  Flame, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Info
} from 'lucide-react';

export const App: React.FC = () => {
  // State for user inputs
  const [selectedOrigin, setSelectedOrigin] = useState<string>(POPULAR_LOCATIONS[0].label);
  const [selectedDestination, setSelectedDestination] = useState<string>(POPULAR_LOCATIONS[5].label);
  const [pujaDay, setPujaDay] = useState<PujaDay>('Panchami');
  const [startTime, setStartTime] = useState<string>('17:00');
  const [maxHours, setMaxHours] = useState<number>(5);
  const [modePreference, setModePreference] = useState<TransitModePreference>('Fastest');
  const [hasVipPass, setHasVipPass] = useState<boolean>(false);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');

  // Execution & Agent state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [activePlan, setActivePlan] = useState<RoutePlan | null>(null);
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'itinerary' | 'agents'>('map');

  const orchestrator = useMemo(() => new MasterOrchestrator(), []);

  const themesList = [
    'Grand Lighting & Architecture',
    'Contemporary Art',
    'Heritage & Traditional',
    'Social Theme',
    'Bonedi Bari'
  ];

  // Helper to get coordinates of origin/dest
  const getCoords = (label: string): { lat: number; lng: number } => {
    const loc = POPULAR_LOCATIONS.find(l => l.label === label);
    if (loc) return { lat: loc.lat, lng: loc.lng };
    const p = DURGA_PUJA_PANDALS.find(p => p.name === label);
    if (p) return { lat: p.lat, lng: p.lng };
    return { lat: 22.5726, lng: 88.3639 };
  };

  const handleGenerateRoute = async () => {
    setIsProcessing(true);
    setAgentLogs([]);
    setActivePlan(null);

    const originCoords = getCoords(selectedOrigin);
    const destCoords = getCoords(selectedDestination);

    const prefs: UserPreferences = {
      origin: selectedOrigin,
      originLat: originCoords.lat,
      originLng: originCoords.lng,
      destination: selectedDestination,
      destinationLat: destCoords.lat,
      destinationLng: destCoords.lng,
      pujaDay,
      startTime,
      maxHours,
      targetThemes: selectedThemes,
      modePreference,
      hasVipPass
    };

    try {
      const plan = await orchestrator.runOrchestrationPipeline(prefs, newLog => {
        setAgentLogs(prev => [...prev, newLog]);
      });
      setActivePlan(plan);
    } catch (err) {
      console.error('Orchestration error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Run initial route once on mount
  useEffect(() => {
    handleGenerateRoute();
  }, []);

  const handleTriggerSimulation = async (event: SimulationEvent) => {
    if (!activePlan) return;
    setIsProcessing(true);
    try {
      const replanned = await orchestrator.handleReplanningEvent(activePlan, event, newLog => {
        setAgentLogs(prev => [...prev, newLog]);
      });
      setActivePlan(replanned);
    } catch (err) {
      console.error('Replanning error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const dayFactor = PUJA_DAY_FACTORS[pujaDay];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-amber-500/30 px-4 lg:px-8 py-3 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/30 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xl">
              🪔
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-rose-400 bg-clip-text text-transparent">
                PujoPath AI
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Track 4: Autonomous Orchestration
              </span>
              <span className="text-[10px] font-mono text-slate-500 hidden md:inline">
                SESSION: DP_2026_FLOW
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Agentic Durga Puja Pandal Hopping & Real-Time Navigation System • Google DeepMind Stack
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>LIVE | KOLKATA METRO & POLICE CROWD MATRIX</span>
          </div>

          <a
            href="https://github.com/Shreyashi36/Deepmind-pujjo-hopper"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-xs font-semibold text-amber-200 transition-colors shadow-lg"
          >
            <span>GitHub Code</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-xs text-purple-300 font-mono shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="hidden sm:inline">Antigravity Agent</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Constraints & Controls (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col">
          
          {/* User Input & Preference Card */}
          <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl border border-amber-500/20 p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <h2 className="font-bold text-sm text-white">Route Constraints</h2>
              </div>
              <span className="text-[11px] text-slate-400">Kolkata Puja 2026</span>
            </div>

            {/* Origin & Destination */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Origin (Starting Point)</span>
                </label>
                <select
                  value={selectedOrigin}
                  onChange={e => setSelectedOrigin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  {POPULAR_LOCATIONS.map(loc => (
                    <option key={loc.label} value={loc.label}>{loc.label} ({loc.zone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Destination (Ending Point)</span>
                </label>
                <select
                  value={selectedDestination}
                  onChange={e => setSelectedDestination(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                >
                  {POPULAR_LOCATIONS.map(loc => (
                    <option key={loc.label} value={loc.label}>{loc.label} ({loc.zone})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Puja Day Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Puja Day (Tithi)</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  dayFactor.trafficCongestion === 'Extreme' ? 'bg-rose-900/60 text-rose-300' :
                  dayFactor.trafficCongestion === 'High' ? 'bg-orange-900/60 text-orange-300' :
                  'bg-emerald-900/60 text-emerald-300'
                }`}>
                  {dayFactor.trafficCongestion} Crowd ({dayFactor.crowdMultiplier}x)
                </span>
              </label>
              <select
                value={pujaDay}
                onChange={e => setPujaDay(e.target.value as PujaDay)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="Dwitiya">Dwitiya (Light Crowd, Early Viewing)</option>
                <option value="Tritiya">Tritiya (Moderate Traffic)</option>
                <option value="Chaturthi">Chaturthi (Inauguration Night)</option>
                <option value="Panchami">Panchami (Surge Starts)</option>
                <option value="Sasthi">Sasthi (Bodhon & Grand Opening)</option>
                <option value="Saptami">Saptami (Peak Night 1)</option>
                <option value="Ashtami">Ashtami (Sandhi Puja & Mega Crowd)</option>
                <option value="Nabami">Nabami (All-Night Carnivals)</option>
                <option value="Dashami">Dashami (Sindoor Khela & Immersion)</option>
              </select>
            </div>

            {/* Time & Duration */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Start Time</span>
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Duration Window
                </label>
                <select
                  value={maxHours}
                  onChange={e => setMaxHours(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value={3}>3 Hours (3-4 Pandals)</option>
                  <option value={5}>5 Hours (5-6 Pandals)</option>
                  <option value={8}>8 Hours (All-night 8+ Pandals)</option>
                </select>
              </div>
            </div>

            {/* Transit Optimization Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Transit Optimization Goal
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                {(['Fastest', 'Cheapest (Budget ₹)', 'Least Walking (Comfort)'] as TransitModePreference[]).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setModePreference(mode)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      modePreference === mode
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Filter & VIP Pass */}
            <div className="space-y-2 pt-1 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Theme Preferences</label>
                <span className="text-[10px] text-slate-500">Optional</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {themesList.map(theme => {
                  const isSelected = selectedThemes.includes(theme);
                  return (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => {
                        setSelectedThemes(prev =>
                          isSelected ? prev.filter(t => t !== theme) : [...prev, theme]
                        );
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10.5px] transition-all border ${
                        isSelected
                          ? 'bg-red-950/80 border-red-500 text-red-200 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      {theme}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasVipPass}
                    onChange={e => setHasVipPass(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
                  />
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                    <span>I have a VIP / Sponsor Pass</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Action Button */}
            <button
              disabled={isProcessing}
              onClick={handleGenerateRoute}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Multi-Agent Orchestrator Running...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Autonomous Route</span>
                </>
              )}
            </button>
          </div>

          {/* Real-time Disruption Simulation (Stress Test for Judges) */}
          <SimulationControls
            onTriggerSimulation={handleTriggerSimulation}
            isProcessing={isProcessing}
          />
        </div>

        {/* Right Column: Interactive Map, Trace Logs & Detailed Itinerary (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4 flex flex-col">
          
          {/* Main Display Tabs */}
          <div className="flex items-center justify-between bg-slate-950/80 backdrop-blur-md rounded-2xl border border-amber-500/20 p-1.5 shadow-xl">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'map'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Interactive Map</span>
              </button>

              <button
                onClick={() => setActiveTab('itinerary')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'itinerary'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Hopping Schedule</span>
                {activePlan && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-extrabold">
                    {activePlan.stops.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('agents')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === 'agents'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Multi-Agent Trace</span>
                <span className="px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                  {agentLogs.length}
                </span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Kolkata Real-time Network Active</span>
            </div>
          </div>

          {/* Dynamic Tab Views */}
          <div className="grid grid-cols-1 gap-4 flex-1 min-h-[480px]">
            {activeTab === 'map' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
                <div className="lg:col-span-8 h-[480px] lg:h-full">
                  <MapComponent
                    allPandals={DURGA_PUJA_PANDALS}
                    activePlan={activePlan}
                    selectedPandal={selectedPandal}
                    onSelectPandal={p => setSelectedPandal(p)}
                  />
                </div>
                <div className="lg:col-span-4 h-full flex flex-col">
                  {isProcessing ? (
                    <div className="h-full min-h-[380px] bg-slate-950/80 backdrop-blur-md rounded-2xl border border-amber-500/30 p-6 flex flex-col items-center justify-center text-center space-y-3 animate-pulse">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <Cpu className="w-6 h-6 text-white animate-spin" />
                      </div>
                      <h4 className="font-bold text-sm text-white">Multi-Agent Orchestrator Active</h4>
                      <p className="text-xs text-amber-200/80 max-w-xs">
                        Synthesizing crowd forecasts, police cordons & multi-modal metro routes across 379 pandals...
                      </p>
                    </div>
                  ) : activePlan ? (
                    <ItineraryCard
                      plan={activePlan}
                      onSelectPandal={p => setSelectedPandal(p)}
                    />
                  ) : (
                    <div className="h-full min-h-[380px] bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                      <Compass className="w-8 h-8 text-amber-500/50" />
                      <p className="text-xs text-slate-300 font-semibold">Ready to Generate Route</p>
                      <p className="text-[11px] text-slate-500">Configure your starting point and click the orange "Generate Autonomous Route" button on the left.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <div className="h-full min-h-[680px] flex flex-col">
                {activePlan ? (
                  <ItineraryCard
                    plan={activePlan}
                    onSelectPandal={p => setSelectedPandal(p)}
                  />
                ) : (
                  <div className="h-full min-h-[500px] bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-center p-8 text-center text-slate-400">
                    Please generate a route first to view the full hopping schedule.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'agents' && (
              <div className="h-full min-h-[680px] flex flex-col">
                <AgentVisualizer
                  logs={agentLogs}
                  isProcessing={isProcessing}
                />
              </div>
            )}
          </div>

          {/* Quick Agent Trace preview at the bottom when on Map view */}
          {activeTab === 'map' && (
            <div className="w-full">
              <AgentVisualizer
                logs={agentLogs}
                isProcessing={isProcessing}
              />
            </div>
          )}
        </div>
      </main>

      {/* Pandal Detail Modal */}
      <PandalDetailModal
        pandal={selectedPandal}
        onClose={() => setSelectedPandal(null)}
      />

      {/* Footer with Kaggle & Tech Credits */}
      <footer className="mt-8 border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
        <p>
          Built for the <b className="text-amber-400">Google DeepMind Hyderabad Hackathon</b> (Track 4: Autonomous Orchestration with Managed Agents).
        </p>
        <p className="mt-1 text-[11px] text-slate-600">
          Powered by Gemini 3.8 Flash & Antigravity Interactions API • Kolkata Durga Puja Geospatial Matrix 2026.
        </p>
      </footer>
    </div>
  );
};

export default App;
