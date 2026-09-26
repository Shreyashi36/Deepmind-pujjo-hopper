import React, { useEffect, useRef } from 'react';
import { AgentLog } from '../agents/types';
import { Bot, Cpu, GitBranch, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

interface AgentVisualizerProps {
  logs: AgentLog[];
  isProcessing: boolean;
}

export const AgentVisualizer: React.FC<AgentVisualizerProps> = ({ logs, isProcessing }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getAgentBadge = (agent: AgentLog['agent']) => {
    switch (agent) {
      case 'MASTER_ORCHESTRATOR':
        return {
          icon: <Cpu className="w-3.5 h-3.5 text-purple-400" />,
          color: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
          name: 'Master Orchestrator'
        };
      case 'PANDAL_CURATOR':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
          color: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
          name: 'Pandal Curator'
        };
      case 'CROWD_TRAFFIC_ANALYST':
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
          color: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
          name: 'Crowd & Traffic Forecaster'
        };
      case 'TRANSIT_ROUTER':
        return {
          icon: <Navigation className="w-3.5 h-3.5 text-blue-400" />,
          color: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
          name: 'Multi-Modal Router'
        };
      case 'DYNAMIC_REPLANNER':
        return {
          icon: <GitBranch className="w-3.5 h-3.5 text-emerald-400" />,
          color: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
          name: 'Self-Healing Replanner'
        };
      default:
        return {
          icon: <Bot className="w-3.5 h-3.5 text-slate-400" />,
          color: 'bg-slate-800 border-slate-700 text-slate-300',
          name: 'Agent'
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Cpu className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
          </div>
          <span className="font-bold text-xs uppercase tracking-wider text-amber-200">
            Track 4: Autonomous Multi-Agent Execution Stream
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Orchestrating...
            </span>
          )}
          <span className="text-[11px] text-slate-400 font-mono">
            {logs.length} events
          </span>
        </div>
      </div>

      {/* Log Feed */}
      <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Bot className="w-8 h-8 mb-2 text-slate-600 opacity-60" />
            <p className="text-xs">Multi-Agent loop ready.</p>
            <p className="text-[11px] text-slate-600 mt-1">Select your starting/ending points and click "Generate Multi-Agent Route".</p>
          </div>
        ) : (
          logs.map(log => {
            const badge = getAgentBadge(log.agent);
            const isThought = log.type === 'thought';
            const isAlert = log.type === 'alert';
            const isSuccess = log.type === 'success';

            return (
              <div
                key={log.id}
                className={`p-2.5 rounded-xl border transition-all duration-200 ${
                  isAlert
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    : isSuccess
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : isThought
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${badge.color}`}>
                      {badge.icon}
                      {badge.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-1.5 py-0.5 rounded bg-slate-800/60">
                      {log.type}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
                <div className="text-[11.5px] leading-relaxed text-slate-200 pl-1">
                  {log.content}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
