import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Pandal, METRO_STATIONS } from '../data/kolkataData';
import { RoutePlan } from '../agents/types';

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

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map centered at Central/South Kolkata
    const map = L.map(mapContainerRef.current, {
      center: [22.545, 88.365],
      zoom: 13,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Dark styled CartoDB tile layer for sleek aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
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

    // Render Metro stations with subtle icons
    METRO_STATIONS.forEach(station => {
      const metroIcon = L.divIcon({
        className: 'custom-metro-icon',
        html: `<div style="background-color: #2563eb; color: white; width: 20px; height: 20px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">M</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([station.lat, station.lng], { icon: metroIcon })
        .bindTooltip(`<b>Metro:</b> ${station.name} (${station.line})`, { direction: 'top' });
      layerGroup.addLayer(marker);
    });

    // If there is an active plan, draw the route polyline
    if (activePlan) {
      // 1. Initial transit line
      const initCoords: [number, number][] = [
        activePlan.initialTransit.fromCoords,
        activePlan.initialTransit.toCoords
      ];
      const initLine = L.polyline(initCoords, {
        color: activePlan.initialTransit.lineColor || '#3b82f6',
        weight: 4,
        opacity: 0.8,
        dashArray: activePlan.initialTransit.mode === 'WALK' ? '6, 8' : undefined
      });
      layerGroup.addLayer(initLine);
      bounds.extend(initCoords[0]);
      bounds.extend(initCoords[1]);

      // Start origin marker
      const startIcon = L.divIcon({
        className: 'custom-start-icon',
        html: `<div style="background-color: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); white-space: nowrap;">🚩 Origin</div>`,
        iconAnchor: [30, 25]
      });
      layerGroup.addLayer(L.marker(initCoords[0], { icon: startIcon }));

      // 2. Stops and intermediate legs
      activePlan.stops.forEach((stop, index) => {
        const p = stop.pandal;
        bounds.extend([p.lat, p.lng]);

        const crowdColor = 
          stop.crowdLevel === 'Extreme' ? '#dc2626' :
          stop.crowdLevel === 'Heavy' ? '#ea580c' :
          stop.crowdLevel === 'Moderate' ? '#d97706' : '#16a34a';

        const pandalIcon = L.divIcon({
          className: 'custom-pandal-icon',
          html: `
            <div style="background: linear-gradient(135deg, ${crowdColor}, #991b1b); color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.4); cursor: pointer; transition: transform 0.2s;">
              ${stop.stopOrder}
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const marker = L.marker([p.lat, p.lng], { icon: pandalIcon })
          .on('click', () => onSelectPandal(p))
          .bindPopup(`
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 200px;">
              <div style="font-weight: 700; color: #991b1b; font-size: 14px;">Stop #${stop.stopOrder}: ${p.name}</div>
              <div style="font-size: 12px; color: #4b5563; margin-top: 4px;">${p.themeCategory}</div>
              <div style="margin-top: 8px; font-size: 12px;">
                <b>Arrival:</b> ${stop.arrivalTime} | <b>Queue:</b> ${stop.estimatedQueueMinutes}m
              </div>
              <div style="margin-top: 4px; font-size: 11px; color: #059669; font-weight: 600;">
                ⭐ ${p.famousFor}
              </div>
            </div>
          `);

        layerGroup.addLayer(marker);

        // Draw transit leg to next
        if (stop.transitToNext) {
          const legCoords: [number, number][] = [
            stop.transitToNext.fromCoords,
            stop.transitToNext.toCoords
          ];
          const legLine = L.polyline(legCoords, {
            color: stop.transitToNext.lineColor || '#eab308',
            weight: 5,
            opacity: 0.9,
            dashArray: stop.transitToNext.mode === 'WALK' ? '6, 8' : undefined
          });
          layerGroup.addLayer(legLine);
        }
      });

      // 3. Final transit line to destination
      const finalCoords: [number, number][] = [
        activePlan.finalTransit.fromCoords,
        activePlan.finalTransit.toCoords
      ];
      const finalLine = L.polyline(finalCoords, {
        color: activePlan.finalTransit.lineColor || '#6366f1',
        weight: 4,
        opacity: 0.8,
        dashArray: '4, 6'
      });
      layerGroup.addLayer(finalLine);
      bounds.extend(finalCoords[1]);

      const destIcon = L.divIcon({
        className: 'custom-dest-icon',
        html: `<div style="background-color: #6366f1; color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 700; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); white-space: nowrap;">🏁 Destination</div>`,
        iconAnchor: [30, 25]
      });
      layerGroup.addLayer(L.marker(finalCoords[1], { icon: destIcon }));

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    } else {
      // Default: show all pandals as golden festive markers
      allPandals.forEach(p => {
        bounds.extend([p.lat, p.lng]);

        const defaultIcon = L.divIcon({
          className: 'custom-pandal-icon-default',
          html: `
            <div style="background: linear-gradient(135deg, #b91c1c, #d97706); color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer;">
              🪔
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([p.lat, p.lng], { icon: defaultIcon })
          .on('click', () => onSelectPandal(p))
          .bindTooltip(`<b>${p.name}</b><br/><span style="color:#b91c1c; font-size:11px;">${p.themeCategory}</span>`, { direction: 'top' });

        layerGroup.addLayer(marker);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [allPandals, activePlan, onSelectPandal]);

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
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-amber-900/30 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      
      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-2.5 rounded-xl border border-amber-500/30 text-xs text-amber-100 shadow-xl space-y-1.5 pointer-events-auto max-w-[220px]">
        <div className="font-bold text-amber-400 flex items-center gap-1.5 border-b border-slate-700/60 pb-1">
          <span>🗺️ Map Legend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-600 border border-white text-[9px] flex items-center justify-center font-bold text-white">1</div>
          <span>Pandal Visit Stop</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">M</div>
          <span>Kolkata Metro Station</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-500 rounded"></div>
          <span>Metro Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-amber-500 rounded"></div>
          <span>Shared Auto Corridor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 border-b-2 border-emerald-500 border-dashed"></div>
          <span>Walking Zone</span>
        </div>
      </div>
    </div>
  );
};
