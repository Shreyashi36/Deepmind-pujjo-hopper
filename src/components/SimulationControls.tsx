import React from 'react';
import { SimulationEvent } from '../agents/types';
import { ShieldAlert, Zap, AlertTriangle, RefreshCw } from 'lucide-react';

interface SimulationControlsProps {
  onTriggerSimulation: (event: SimulationEvent) => void;
  isProcessing: boolean;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  onTriggerSimulation,
  isProcessing
}) => {
  const simulationEvents: SimulationEvent[] = [
    {
      id: 'sim-vip-road',
      title: 'Kolkata Police VIP Road Lockdown',
      pandalId: 'p-sreebhumi',
      type: 'ROAD_CORDON',
      description: 'Vehicular movement completely cordoned on VIP Road near Sreebhumi. Pedestrian-only detour active.',
      severity: 'Critical'
    },
    {
      id: 'sim-chetla-surge',
      title: 'Chetla Agrani Sudden Queue Surge (+50m)',
      pandalId: 'p-chetla-agrani',
      type: 'QUEUE_SURGE',
      description: 'VIP gate VIP convoy entry caused general queue back-log. Wait times surged past 105 mins.',
      severity: 'Warning'
    },
    {
      id: 'sim-metro-delay',
      title: 'South Kolkata Metro Technical Congestion',
      type: 'METRO_DELAY',
      description: 'Kalighat & Jatin Das Park stations overcrowded. Entry restricted for 25 minutes.',
      severity: 'Warning'
    }
  ];

  return (
    <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl border border-rose-500/20 shadow-2xl p-4">
      <div className="flex items-center justify-between mb-3 border-b border-rose-500/20 pb-2">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
          <Zap className="w-4 h-4 animate-bounce" />
          <span>Track 4 Live Disruption & Self-Healing Stress Test</span>
        </div>
        <span className="text-[10px] text-slate-400">Judge Interactive Demo</span>
      </div>

      <p className="text-xs text-slate-300 mb-3">
        Test how the autonomous agent detects real-time disruptions and repairs itineraries dynamically without deadlocking:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {simulationEvents.map(sim => (
          <button
            key={sim.id}
            disabled={isProcessing}
            onClick={() => onTriggerSimulation(sim)}
            className="flex flex-col items-start p-2.5 rounded-xl text-left bg-gradient-to-br from-slate-900 to-rose-950/40 border border-rose-500/30 hover:border-rose-400 hover:from-rose-950/60 hover:to-slate-900 text-xs transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-1.5 font-bold text-rose-300 group-hover:text-rose-200">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{sim.title}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              {sim.description}
            </div>
            <div className="mt-2 text-[10px] font-semibold text-amber-400 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
              <span>Trigger Self-Healing</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
