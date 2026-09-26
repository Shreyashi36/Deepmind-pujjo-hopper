import React from 'react';
import { Pandal } from '../data/kolkataData';
import { X, MapPin, Sparkles, Navigation, Clock, ShieldCheck, Ticket } from 'lucide-react';

interface PandalDetailModalProps {
  pandal: Pandal | null;
  onClose: () => void;
}

export const PandalDetailModal: React.FC<PandalDetailModalProps> = ({ pandal, onClose }) => {
  if (!pandal) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Banner */}
        <div className="p-5 bg-gradient-to-r from-red-900 via-amber-900 to-slate-900 border-b border-amber-500/30 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
            <span>{pandal.zone} Kolkata Pandal</span>
            <span>•</span>
            <span>⭐ {pandal.rating} / 5.0</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">{pandal.name}</h2>
          <p className="text-xs text-amber-200/90 mt-0.5">{pandal.themeCategory}</p>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-300">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="text-amber-400 font-bold flex items-center gap-1.5 text-xs mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Famous For</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">{pandal.famousFor}</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-200 mb-1">About the Pandal</h4>
            <p className="leading-relaxed text-slate-400">{pandal.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Base Queue</span>
              </div>
              <div className="text-white font-bold text-sm">~{pandal.baseWaitMin} mins</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Off-peak baseline</div>
            </div>

            <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
              <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-emerald-400" />
                <span>VIP Pass Lane</span>
              </div>
              <div className="text-white font-bold text-sm">
                {pandal.vipPassAvailable ? 'Available (Fast-track)' : 'General Only'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {pandal.vipPassAvailable ? '<10 min wait with VIP pass' : 'Single queue line'}
              </div>
            </div>
          </div>

          <div className="space-y-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>Transit & Ingress / Egress Info</span>
            </div>
            <div className="text-[11px] space-y-1 text-slate-300">
              <div>• <b>Nearest Metro:</b> {pandal.nearestMetro} ({pandal.metroWalkMin} min walk)</div>
              <div>• <b>Nearest Shared Auto Stand:</b> {pandal.nearestAutoStand}</div>
              <div>• <b>Official Entry Gate:</b> {pandal.entryGate}</div>
              <div>• <b>Official Exit Gate:</b> {pandal.exitGate}</div>
              <div>
                • <b>Police Zone:</b> {pandal.policeCordonZone ? 'Vehicular cordon active during peak hours' : 'Normal vehicle entry with parking restrictions'}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-lg shadow-amber-600/30"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
