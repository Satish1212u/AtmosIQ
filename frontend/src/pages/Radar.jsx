import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeather } from '../context/WeatherContext';
import { Map as MapIcon, Layers, CloudRain, Wind, ThermometerSun, MapPin, Activity, Radio, RefreshCw } from 'lucide-react';
import L from 'leaflet';
import { motion } from 'framer-motion';

// Custom Animated Marker for Radar
const pulseIcon = new L.DivIcon({
  className: 'radar-pulse-marker',
  html: `
    <div class="relative flex items-center justify-center w-12 h-12">
      <div class="absolute inset-0 bg-cyan-500 rounded-full animate-ping opacity-75"></div>
      <div class="absolute inset-0 bg-cyan-400 rounded-full animate-pulse opacity-50 blur-sm"></div>
      <div class="relative w-4 h-4 bg-white rounded-full border-2 border-cyan-500 shadow-[0_0_10px_rgba(56,189,248,1)]"></div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24]
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, {
      duration: 2.5,
      easeLinearity: 0.25
    });
  }, [center, map]);
  return null;
};

const RadarMap = () => {
  const { weather, loading } = useWeather();
  // Default to New York (as the fixed default Google Maps location if none provided)
  const defaultLocation = [40.7128, -74.0060];
  
  const [position, setPosition] = useState(defaultLocation);
  const [activeLayer, setActiveLayer] = useState('precipitation_new');
  const [mapLoaded, setMapLoaded] = useState(false);

  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Sync position with weather context when geolocation is granted
  useEffect(() => {
    if (weather?.coord) {
      setPosition([weather.coord.lat, weather.coord.lon]);
    }
  }, [weather]);

  const layers = [
    { id: 'precipitation_new', name: 'Precipitation', icon: <CloudRain className="w-4 h-4" />, color: 'text-blue-400', activeBg: 'bg-blue-500/20 border-blue-400/50' },
    { id: 'clouds_new', name: 'Clouds', icon: <Layers className="w-4 h-4" />, color: 'text-slate-300', activeBg: 'bg-slate-500/20 border-slate-400/50' },
    { id: 'temp_new', name: 'Temperature', icon: <ThermometerSun className="w-4 h-4" />, color: 'text-orange-400', activeBg: 'bg-orange-500/20 border-orange-400/50' },
    { id: 'wind_new', name: 'Wind Speed', icon: <Wind className="w-4 h-4" />, color: 'text-teal-400', activeBg: 'bg-teal-500/20 border-teal-400/50' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-80px)] flex flex-col relative z-10">
      
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 z-20 relative">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
            <Radio className="w-3 h-3 animate-pulse" /> Live Telemetry
          </div>
          <h1 className="text-4xl md:text-5xl font-black flex items-center gap-3 mb-2 text-white drop-shadow-lg tracking-tight font-mono uppercase">
            AtmosIQ <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.55)] animate-pulse">Radar</span>
          </h1>
          <p className="text-slate-200 font-semibold max-w-xl shadow-sm">
            Real-time atmospheric visualization. Automatically syncing with your coordinates when location is enabled.
          </p>
        </motion.div>

        {/* Layer Controls - Desktop */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="hidden md:flex gap-2 glass-dark p-2 rounded-2xl border border-white/15 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        >
          {layers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-extrabold transition-all duration-300 border ${
                activeLayer === layer.id 
                  ? `${layer.activeBg} text-white border-cyan-400/50 shadow-inner` 
                  : 'text-slate-200 hover:text-white hover:bg-white/10 border-transparent'
              }`}
            >
              <span className={activeLayer === layer.id ? layer.color : ''}>{layer.icon}</span>
              {layer.name}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Mobile Layer Controls */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-4 mb-2 z-20 relative no-scrollbar">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black transition-all duration-300 border ${
              activeLayer === layer.id 
                ? `${layer.activeBg} text-white border-cyan-400/50 shadow-inner` 
                : 'bg-slate-950/80 text-slate-200 hover:text-white border-white/15'
            }`}
          >
            <span className={activeLayer === layer.id ? layer.color : ''}>{layer.icon}</span>
            {layer.name}
          </button>
        ))}
      </div>

      {/* Main Map Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
        className="flex-1 rounded-[2rem] overflow-hidden glass border border-white/10 relative z-0 shadow-[0_0_50px_rgba(0,0,0,0.5)] group"
      >
        {/* Loading Overlay */}
        {!mapLoaded && (
          <div className="absolute inset-0 z-[2000] glass-dark flex flex-col items-center justify-center backdrop-blur-xl">
             <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
             <p className="text-cyan-300 font-bold tracking-widest uppercase text-sm animate-pulse">Establishing AtmosIQ Satellite Link...</p>
          </div>
        )}

        <MapContainer 
          center={position} 
          zoom={10} 
          style={{ height: '100%', width: '100%', background: '#0f172a' }}
          zoomControl={false}
          whenReady={() => setTimeout(() => setMapLoaded(true), 500)}
        >
          <ChangeView center={position} />
          
          {/* Base Map (Dark Theme - CartoDB Dark Matter) */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Dynamic Weather Layer from OpenWeather */}
          {OPENWEATHER_API_KEY && (
            <TileLayer
              key={activeLayer} // Re-mount when layer changes to force refresh
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
              url={`https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
              opacity={0.65}
              className="weather-layer-transition"
            />
          )}

          <Marker position={position} icon={pulseIcon}>
            <Popup className="custom-popup" closeButton={false}>
              <div className="p-1 min-w-[120px]">
                <div className="text-[10px] uppercase font-bold text-cyan-500 tracking-wider mb-1">Target Acquired</div>
                <div className="font-black text-lg text-slate-800 leading-tight mb-1">{weather?.name || "Fixed Location"}</div>
                {weather && (
                   <div className="flex items-center gap-2 text-slate-600 font-medium mt-2 pt-2 border-t border-slate-200">
                     <ThermometerSun className="w-4 h-4 text-orange-500"/>
                     {Math.round(weather.main?.temp)}°C
                   </div>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
        
        {/* Cinematic Map Overlays */}
        <div className="absolute inset-0 pointer-events-none rounded-[2rem] border border-cyan-500/20 z-[1000] shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]"></div>
        
        {/* Floating Info Card */}
        <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none">
          <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
             className="glass-dark backdrop-blur-2xl p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4 pointer-events-auto"
          >
             <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-cyan-400/20 animate-ping"></div>
                <MapPin className="w-6 h-6 text-cyan-400 relative z-10" />
             </div>
             <div>
                 <p className="text-[10px] text-slate-200 font-black uppercase tracking-wider mb-0.5">Focus Point</p>
                 <p className="text-lg font-black text-white leading-none mb-1">{weather?.name || "Default Origin"}</p>
                 <p className="text-xs text-cyan-300 font-bold">
                   Lat: {position[0].toFixed(4)} | Lon: {position[1].toFixed(4)}
                 </p>
             </div>
          </motion.div>
        </div>

        {/* Global Live Status */}
        <div className="absolute top-6 right-6 z-[1000] pointer-events-none">
          <motion.div 
             initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
             className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-xl flex items-center gap-3"
          >
             <span className="relative flex h-2.5 w-2.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
             </span>
             <span className="text-xs font-bold text-white uppercase tracking-widest">Radar Online</span>
          </motion.div>
        </div>

      </motion.div>
      
      {/* Global CSS for Leaflet Overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        .leaflet-container { font-family: 'Outfit', sans-serif; }
        .leaflet-popup-content-wrapper { 
          background: rgba(255, 255, 255, 0.95); 
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.5);
        }
        .leaflet-popup-tip { background: rgba(255, 255, 255, 0.95); }
        .weather-layer-transition {
          transition: opacity 0.5s ease-in-out;
        }
        .radar-pulse-marker {
          background: transparent;
          border: none;
        }
      `}} />
    </div>
  );
};

export default RadarMap;
