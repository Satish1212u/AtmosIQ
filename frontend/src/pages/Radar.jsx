import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeather } from '../context/WeatherContext';
import { Layers, CloudRain, Wind, ThermometerSun, MapPin, Radio, RefreshCw, Compass } from 'lucide-react';
import L from 'leaflet';
import { motion } from 'framer-motion';

// Luxury Gold Pulse Marker for Radar
const luxuryPulseIcon = new L.DivIcon({
  className: 'radar-luxury-marker',
  html: `
    <div class="relative flex items-center justify-center w-12 h-12">
      <div class="absolute inset-0 bg-[#C5A880] rounded-full animate-ping opacity-45"></div>
      <div class="absolute inset-2 bg-[#DFCCA6] rounded-full animate-pulse opacity-60 blur-xs"></div>
      <div class="relative w-4 h-4 bg-[#FAF8F5] rounded-full border-2 border-[#B89758] shadow-[0_0_12px_rgba(184,151,88,0.7)]"></div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24]
});

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 10, {
      duration: 2.2,
      easeLinearity: 0.25
    });
  }, [center, map]);
  return null;
};

const RadarMap = () => {
  const { weather } = useWeather();
  const defaultLocation = [46.2044, 6.1432]; // Geneva coordinates default

  const [position, setPosition] = useState(defaultLocation);
  const [activeLayer, setActiveLayer] = useState('precipitation_new');
  const [mapLoaded, setMapLoaded] = useState(false);

  const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  useEffect(() => {
    if (weather?.coord) {
      setPosition([weather.coord.lat, weather.coord.lon]);
    }
  }, [weather]);

  const layers = [
    { id: 'precipitation_new', name: 'Precipitation', icon: <CloudRain className="w-3.5 h-3.5" /> },
    { id: 'clouds_new', name: 'Cloud Strata', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'temp_new', name: 'Thermal Vector', icon: <ThermometerSun className="w-3.5 h-3.5" /> },
    { id: 'wind_new', name: 'Wind Velocity', icon: <Wind className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-80px)] flex flex-col relative z-10">

      {/* Header & Precision Instruments Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 z-20 relative">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 border border-[#C5A880]/30 text-[10px] font-roman tracking-[0.25em] text-[#8C6D3F] uppercase mb-2 shadow-xs">
            <Radio className="w-3 h-3 text-[#B89758] animate-pulse" />
            GEOSPATIAL RADAR TERMINAL
          </div>
          <h1 className="text-3xl md:text-4xl font-editorial font-bold text-[#1C1917] tracking-tight">
            Atmospheric Radar Surveillance
          </h1>
          <p className="text-xs text-[#57493A] font-medium max-w-xl mt-0.5">
            Precision geospatial radar tracking live precipitation, tropospheric cloud strata, and thermal vectors.
          </p>
        </motion.div>

        {/* Precision Layer Controls - Desktop */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="hidden md:flex gap-1.5 luxury-panel p-1.5 rounded-2xl shadow-sm"
        >
          {layers.map((layer) => {
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-roman tracking-wider uppercase transition-all duration-300 border cursor-pointer ${isActive
                  ? 'bg-[#FAF5ED] border-[#B89758] text-[#8C6D3F] font-bold shadow-xs'
                  : 'text-[#6B5E51] hover:text-[#1C1917] hover:bg-white/60 border-transparent'
                  }`}
              >
                <span className={isActive ? 'text-[#B89758]' : 'text-[#8C6D3F]'}>{layer.icon}</span>
                {layer.name}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Mobile Layer Controls */}
      <div className="md:hidden flex overflow-x-auto gap-2 pb-3 mb-2 z-20 relative no-scrollbar">
        {layers.map((layer) => {
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-roman uppercase tracking-wider transition-all border ${isActive
                ? 'bg-[#FAF5ED] border-[#B89758] text-[#8C6D3F] font-bold shadow-xs'
                : 'bg-white/80 text-[#57493A] border-[#C5A880]/20'
                }`}
            >
              {layer.icon}
              {layer.name}
            </button>
          );
        })}
      </div>

      {/* Main Terminal Map Frame */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="flex-1 rounded-3xl overflow-hidden luxury-panel relative z-0 shadow-xl border border-[#C5A880]/35"
      >
        {!mapLoaded && (
          <div className="absolute inset-0 z-[2000] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-[#B89758] animate-spin mb-3" />
            <p className="text-xs font-roman tracking-[0.2em] uppercase text-[#786E65]">
              SYNCHRONIZING ORBITAL RADAR SATELLITE...
            </p>
          </div>
        )}

        <MapContainer
          center={position}
          zoom={10}
          style={{ height: '100%', width: '100%', background: '#F5EFEB' }}
          zoomControl={false}
          whenReady={() => setTimeout(() => setMapLoaded(true), 400)}
        >
          <ChangeView center={position} />


          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_CARTO_API_KEY}`}
          />

          {/* Dynamic Weather Layer from OpenWeather */}
          {OPENWEATHER_API_KEY && (
            <TileLayer
              key={activeLayer}
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
              url={`https://tile.openweathermap.org/map/${activeLayer}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`}
              opacity={0.65}
              className="weather-layer-transition"
            />
          )}

          <Marker position={position} icon={luxuryPulseIcon}>
            <Popup className="custom-popup" closeButton={false}>
              <div className="p-1 min-w-[130px]">
                <div className="text-[9px] uppercase font-roman tracking-widest text-[#8C6D3F] mb-0.5">TARGET SYNCHRONIZED</div>
                <div className="font-editorial font-bold text-lg text-[#1C1917] leading-tight mb-1">{weather?.name || "Target Vector"}</div>
                {weather && (
                  <div className="flex items-center gap-2 text-xs text-[#57493A] font-medium pt-1 border-t border-[#C5A880]/20">
                    <ThermometerSun className="w-3.5 h-3.5 text-[#C68A4C]" />
                    {Math.round(weather.main?.temp)}°C · {weather.weather?.[0]?.description}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Floating Focus Point Plaque */}
        <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="luxury-panel p-4 rounded-2xl shadow-lg flex items-center gap-3.5 pointer-events-auto border border-[#C5A880]/35"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#C5A880]/40 flex items-center justify-center text-[#B89758]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-roman text-[#786E65] uppercase tracking-widest mb-0.5">STATION FOCUS</p>
              <p className="text-base font-editorial font-bold text-[#1C1917] leading-none mb-0.5">{weather?.name || "Local Atmosphere"}</p>
              <p className="text-[11px] font-mono text-[#8C6D3F]">
                {position[0].toFixed(4)}° N, {position[1].toFixed(4)}° E
              </p>
            </div>
          </motion.div>
        </div>

        {/* Global Terminal Status Badge */}
        <div className="absolute top-6 right-6 z-[1000] pointer-events-none">
          <div className="luxury-panel px-4 py-1.5 rounded-full shadow-sm flex items-center gap-2.5 border border-[#C5A880]/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B89758] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B89758]"></span>
            </span>
            <span className="text-[10px] font-roman tracking-wider uppercase text-[#6B5E51]">RADAR SURVEILLANCE ACTIVE</span>
          </div>
        </div>

      </motion.div>

      {/* Leaflet Custom Overrides */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .leaflet-container { font-family: 'Plus Jakarta Sans', sans-serif; }
        .leaflet-popup-content-wrapper { 
          background: rgba(255, 255, 255, 0.94); 
          backdrop-filter: blur(12px);
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(60, 48, 35, 0.08);
          border: 1px solid rgba(197, 168, 128, 0.35);
        }
        .leaflet-popup-tip { background: rgba(255, 255, 255, 0.94); }
        .radar-luxury-marker { background: transparent; border: none; }
      `}} />
    </div>
  );
};

export default RadarMap;
