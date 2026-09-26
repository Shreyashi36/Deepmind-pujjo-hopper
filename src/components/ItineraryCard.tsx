import React, { useState } from 'react';
import { RoutePlan, ItineraryStop } from '../agents/types';
import { Clock, IndianRupee, Footprints, AlertTriangle, ChevronDown, ChevronUp, MapPin, Volume2, Sparkles, Navigation, ArrowRight } from 'lucide-react';
import { Pandal } from '../data/kolkataData';

interface ItineraryCardProps {
  plan: RoutePlan;
  onSelectPandal: (pandal: Pandal) => void;
}

export const ItineraryCard: React.FC<ItineraryCardProps> = ({ plan, onSelectPandal }) => {
  const [expandedStop, setExpandedStop] = useState<number | null>(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakSummary = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const text = `Your Durga Puja route is ready for ${plan.pujaDay}. You will visit ${plan.totalPandalsVisited} pandals starting at ${plan.startTime}. Total transit cost is only ${plan.totalCostInr} rupees. First stop is ${plan.stops[0]?.pandal.name}. Enjoy the festive vibe!`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-2xl overflow-hidden">
      {/* Header / Summary stats */}
      <div className="p-4 bg-gradient-to-r from-red-950/60 via-amber-950/40 to-slate-900 border-b border-amber-500/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🪔 {plan.pujaDay} Itinerary
              </span>
              <span className="text-xs text-slate-400">
                {plan.startTime} ➔ {plan.endTime}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 tracking-tight">
              Optimized Hopping Schedule
            </h2>
          </div>

          <button
            onClick={speakSummary}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSpeaking
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30 animate-pulse'
                : 'bg-slate-900/80 hover:bg-amber-950/60 text-amber-200 border-amber-500/30'
            }`}
            title="Audio Briefing"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{isSpeaking ? 'Speaking...' : 'Audio'}</span>
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-2 mt-3.5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Duration</span>
            </div>
            <div className="font-bold text-sm text-white mt-0.5">
              {Math.floor(plan.totalDurationMinutes / 60)}h {plan.totalDurationMinutes % 60}m
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <IndianRupee className="w-3 h-3 text-emerald-400" />
              <span>Budget</span>
            </div>
            <div className="font-bold text-sm text-emerald-300 mt-0.5">
              ₹{plan.totalCostInr}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <Footprints className="w-3 h-3 text-blue-400" />
              <span>Walking</span>
            </div>
            <div className="font-bold text-sm text-blue-300 mt-0.5">
              {(plan.totalWalkMeters / 1000).toFixed(1)} km
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Pandals</span>
            </div>
            <div className="font-bold text-sm text-purple-300 mt-0.5">
              {plan.totalPandalsVisited}
            </div>
          </div>
        </div>

        {/* Police Advisories if any */}
        {plan.policeAdvisories && plan.policeAdvisories.length > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              {plan.policeAdvisories.map((adv, idx) => (
                <div key={idx} className="leading-snug">{adv}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline of Stops */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[440px]">
        {/* Origin Step */}
        <div className="flex items-start gap-3 text-xs">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shadow-lg shadow-emerald-600/30">
              🚩
            </div>
            <div className="w-0.5 h-8 bg-slate-700 mt-1"></div>
          </div>
          <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
            <div className="font-semibold text-slate-200">Starting from: {plan.initialTransit.fromName}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <ArrowRight className="w-3 h-3 text-amber-400" />
              <span>{plan.initialTransit.instruction} ({plan.initialTransit.durationMinutes} min)</span>
            </div>
          </div>
        </div>

        {/* Pandals List */}
        {plan.stops.map(stop => {
          const isExpanded = expandedStop === stop.stopOrder;
          const p = stop.pandal;

          return (
            <div key={stop.stopOrder} className="flex items-start gap-3 text-xs">
              {/* Stepper Node */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => {
                    setExpandedStop(isExpanded ? null : stop.stopOrder);
                    onSelectPandal(p);
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                    stop.crowdLevel === 'Extreme'
                      ? 'bg-rose-600 text-white shadow-rose-600/30'
                      : stop.crowdLevel === 'Heavy'
                      ? 'bg-orange-600 text-white shadow-orange-600/30'
                      : 'bg-amber-600 text-white shadow-amber-600/30'
                  }`}
                >
                  {stop.stopOrder}
                </button>
                <div className="w-0.5 h-full bg-slate-800 my-1"></div>
              </div>

              {/* Stop Card */}
              <div className="flex-1 bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 rounded-xl overflow-hidden transition-all">
                <div
                  onClick={() => {
                    setExpandedStop(isExpanded ? null : stop.stopOrder);
                    onSelectPandal(p);
                  }}
                  className="p-3 cursor-pointer flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm hover:text-amber-300 transition-colors">
                        {p.name}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        stop.crowdLevel === 'Extreme' ? 'bg-rose-950 text-rose-300 border border-rose-600/40' :
                        stop.crowdLevel === 'Heavy' ? 'bg-orange-950 text-orange-300 border border-orange-600/40' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-600/40'
                      }`}>
                        {stop.crowdLevel} Crowd
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-[11px] mt-1">
                      <span>🕒 Arrival: <b className="text-slate-200">{stop.arrivalTime}</b></span>
                      <span>⏳ Queue: <b className="text-amber-300">~{stop.estimatedQueueMinutes}m</b></span>
                      <span>👀 Stay: <b>{stop.viewingMinutes}m</b></span>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 border-t border-slate-800/60 bg-slate-950/40 space-y-2">
                    <div className="text-[11.5px] text-amber-200/90 font-medium">
                      ✨ {p.famousFor}
                    </div>

                    {stop.alert && (
                      <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[11px]">
                        {stop.alert}
                      </div>
                    )}

                    <div className="space-y-1 text-slate-300 text-[11px]">
                      {stop.tips.map((tip, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-1.5">
                          <span className="text-amber-400">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10.5px] text-slate-400">
                      <span>🚇 Nearest: {p.nearestMetro} ({p.metroWalkMin}m walk)</span>
                      <span>🛺 Auto: {p.nearestAutoStand}</span>
                    </div>
                  </div>
                )}

                {/* Transit to next */}
                {stop.transitToNext && (
                  <div className="px-3 py-2 bg-slate-950/70 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{stop.transitToNext.instruction}</span>
                    </div>
                    <span className="font-semibold text-emerald-400 shrink-0 ml-2">
                      {stop.transitToNext.costInr > 0 ? `₹${stop.transitToNext.costInr}` : 'Free'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Final Destination Step */}
        <div className="flex items-start gap-3 text-xs pt-1">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shadow-lg shadow-indigo-600/30">
              🏁
            </div>
          </div>
          <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-2.5">
            <div className="font-semibold text-slate-200">Destination Reached: {plan.finalTransit.toName}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Estimated End Time: {plan.endTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
