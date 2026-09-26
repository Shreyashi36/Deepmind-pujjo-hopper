import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Pandal, METRO_STATIONS } from '../data/kolkataData';
import { RoutePlan } from '../agents/types';
import { Sparkles, Layers, Eye } from 'lucide-react';

interface MapComponentProps {
  allPandals: Pandal[];
  activePlan: RoutePlan | null;
  selectedPandal: Pandal | null;
  onSelectPandal: (pandal: Pandal) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  allPandals,
  activePlan,
  selectedPandal,
  onSelectPandal
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapDisplayMode, setMapDisplayMode] = useState<'focused' | 'flagship' | 'all'>('focused');

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map centered at Kolkata
    const map = L.map(mapContainerRef.current, {
      center: [22.545, 88.365],
      zoom: 13,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Free OpenStreetMap tile layer (dark night inversion styled via CSS .leaflet-tile)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers and route lines
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const bounds = L.latLngBounds([]);

    // 1. Render Metro stations with sleek neon blue badges
    METRO_STATIONS.forEach(station => {
      const metroIcon = L.divIcon({
        className: 'custom-metro-icon',
        html: `
          <div style="background: linear-gradient(135deg, #1d4ed8, #0284c7); color: #38bdf8; width: 22px; height: 22px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; border: 1.5px solid #38bdf8; box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);">
            🚇
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([station.lat, station.lng], { icon: metroIcon })
        .bindTooltip(`<b>Metro:</b> ${station.name} <br/><span style="color:#38bdf8; font-size:10px;">${station.line}</span>`, { direction: 'top' });
      layerGroup.addLayer(marker);
    });

    // 2. If active plan exists and in focused mode, render the glowing route
    if (activePlan && mapDisplayMode === 'focused') {
      // Initial transit line
      const initCoords: [number, number][] = [
        activePlan.initialTransit.fromCoords,
        activePlan.initialTransit.toCoords
      ];
      const initLine = L.polyline(initCoords, {
        color: '#06b6d4', // Cyan neon
        weight: 5,
        opacity: 0.9,
        dashArray: activePlan.initialTransit.mode === 'WALK' ? '8, 8' : undefined
      });
      layerGroup.addLayer(initLine);
      bounds.extend(initCoords[0]);
      bounds.extend(initCoords[1]);

      // Start origin marker
      const startIcon = L.divIcon({
        className: 'custom-start-icon',
        html: `
          <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 5px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; border: 2px solid #34d399; box-shadow: 0 0 16px rgba(16, 185, 129, 0.6); white-space: nowrap; display: flex; align-items: center; gap: 4px;">
            <span>🚩</span> <span>Start: ${activePlan.initialTransit.fromName.split(' ')[0]}</span>
          </div>
        `,
        iconAnchor: [40, 25]
      });
      layerGroup.addLayer(L.marker(initCoords[0], { icon: startIcon }));

      // Intermediate stops with glowing numbered pins
      activePlan.stops.forEach((stop, index) => {
        const p = stop.pandal;
        bounds.extend([p.lat, p.lng]);

        const crowdGlow = 
          stop.crowdLevel === 'Extreme' ? '#f43f5e' :
          stop.crowdLevel === 'Heavy' ? '#f97316' :
          stop.crowdLevel === 'Moderate' ? '#f59e0b' : '#10b981';

        const pandalIcon = L.divIcon({
          className: 'custom-pandal-icon',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="position: absolute; width: 42px; height: 42px; border-radius: 50%; background: ${crowdGlow}; opacity: 0.25; filter: blur(4px); animation: pulse 2s infinite;"></div>
              <div style="background: linear-gradient(135deg, ${crowdGlow}, #7f1d1d); color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; border: 2.5px solid #ffffff; box-shadow: 0 0 14px ${crowdGlow}; transition: transform 0.2s;">
                ${stop.stopOrder}
              </div>
            </div>
          `,
          iconSize: [42, 42],
          iconAnchor: [21, 21]
        });

        const marker = L.marker([p.lat, p.lng], { icon: pandalIcon })
          .on('click', () => onSelectPandal(p))
          .bindPopup(`
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 210px; color: #f8fafc;">
              <div style="font-weight: 800; color: #fbbf24; font-size: 14px;">#${stop.stopOrder} ${p.name}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">${p.themeCategory}</div>
              <div style="margin-top: 8px; font-size: 12px; background: rgba(30, 41, 59, 0.8); padding: 6px; border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.2);">
                <div>🕒 <b>Arrival:</b> ${stop.arrivalTime}</div>
                <div>⏳ <b>Queue:</b> <span style="color: #f59e0b; font-weight: bold;">~${stop.estimatedQueueMinutes} mins</span></div>
              </div>
              <div style="margin-top: 6px; font-size: 11px; color: #34d399; font-weight: 600;">
                ⭐ ${p.famousFor}
              </div>
            </div>
          `);

        layerGroup.addLayer(marker);

        // Connecting transit polyline with glowing neon styling
        if (stop.transitToNext) {
          const legCoords: [number, number][] = [
            stop.transitToNext.fromCoords,
            stop.transitToNext.toCoords
          ];
          const legLine = L.polyline(legCoords, {
            color: stop.transitToNext.mode === 'METRO' ? '#38bdf8' : stop.transitToNext.mode === 'AUTO' ? '#fbbf24' : '#34d399',
            weight: 6,
            opacity: 0.95,
            dashArray: stop.transitToNext.mode === 'WALK' ? '8, 8' : undefined
          });
          layerGroup.addLayer(legLine);
        }
      });

      // Final transit line to destination
      const finalCoords: [number, number][] = [
        activePlan.finalTransit.fromCoords,
        activePlan.finalTransit.toCoords
      ];
      const finalLine = L.polyline(finalCoords, {
        color: '#a855f7', // Purple neon
        weight: 5,
        opacity: 0.9,
        dashArray: '6, 8'
      });
      layerGroup.addLayer(finalLine);
      bounds.extend(finalCoords[1]);

      const destIcon = L.divIcon({
        className: 'custom-dest-icon',
        html: `
          <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 5px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; border: 2px solid #c084fc; box-shadow: 0 0 16px rgba(168, 85, 247, 0.6); white-space: nowrap; display: flex; align-items: center; gap: 4px;">
            <span>🏁</span> <span>End: ${activePlan.finalTransit.toName.split(' ')[0]}</span>
          </div>
        `,
        iconAnchor: [40, 25]
      });
      layerGroup.addLayer(L.marker(finalCoords[1], { icon: destIcon }));

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    } else {
      // Flagship or All pandals mode
      const displaySet = mapDisplayMode === 'flagship' 
        ? allPandals.filter(p => p.rating >= 4.8).slice(0, 30) 
        : allPandals;

      displaySet.forEach(p => {
        bounds.extend([p.lat, p.lng]);

        const defaultIcon = L.divIcon({
          className: 'custom-pandal-icon-default',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="background: linear-gradient(135deg, #dc2626, #b45309); color: #fef08a; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; border: 2px solid #fef08a; box-shadow: 0 0 12px rgba(245, 158, 11, 0.5);">
                🪔
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([p.lat, p.lng], { icon: defaultIcon })
          .on('click', () => onSelectPandal(p))
          .bindTooltip(`<b>${p.name}</b><br/><span style="color:#fbbf24; font-size:10px;">⭐ ${p.rating}★ • ${p.themeCategory}</span>`, { direction: 'top' });

        layerGroup.addLayer(marker);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [allPandals, activePlan, mapDisplayMode, onSelectPandal]);

  // Highlight selected pandal
  useEffect(() => {
    if (selectedPandal && mapInstanceRef.current) {
      mapInstanceRef.current.panTo([selectedPandal.lat, selectedPandal.lng], {
        animate: true,
        duration: 0.8
      });
    }
  }, [selectedPandal]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-slate-950">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Top Map Mode Switcher */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-amber-500/30 shadow-xl">
        <button
          onClick={() => setMapDisplayMode('focused')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            mapDisplayMode === 'focused'
              ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📍 Active Route
        </button>
        <button
          onClick={() => setMapDisplayMode('flagship')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            mapDisplayMode === 'flagship'
              ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ⭐ Flagship Hubs
        </button>
        <button
          onClick={() => setMapDisplayMode('all')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
            mapDisplayMode === 'all'
              ? 'bg-amber-500/30 text-amber-300 border border-amber-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🌐 All 379 Pandals
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-slate-950/95 backdrop-blur-md px-3.5 py-3 rounded-xl border border-amber-500/30 text-xs text-amber-100 shadow-2xl space-y-2 pointer-events-auto max-w-[220px]">
        <div className="font-bold text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Kolkata Transit Matrix</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-rose-600 border-2 border-white text-[9px] flex items-center justify-center font-bold text-white shadow-[0_0_8px_#e11d48]">1</div>
          <span className="text-[11px]">Pandal Stop Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold shadow-[0_0_8px_#2563eb]">🚇</div>
          <span className="text-[11px]">Kolkata Metro</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 bg-cyan-400 rounded shadow-[0_0_8px_#22d3ee]"></div>
          <span className="text-[11px]">Metro Transit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1.5 bg-amber-400 rounded shadow-[0_0_8px_#f59e0b]"></div>
          <span className="text-[11px]">Shared Auto Link</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 border-b-2 border-emerald-400 border-dashed shadow-[0_0_8px_#34d399]"></div>
          <span className="text-[11px]">Walk Corridor</span>
        </div>
      </div>
    </div>
  );
};
