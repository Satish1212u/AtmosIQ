import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import {
  ThermometerSun, Droplets, Wind, Gauge,
  Sun, Sunset, CloudRain, Sunrise, Sparkles, Compass
} from 'lucide-react';
import { getAQIStatus } from '../utils/aqiUtils';
import { LuxuryCompass3D, LuxuryCelestialTrack3D } from '../components/3d/LuxuryInstrument3D';

const Dashboard = () => {
  const { weather, forecast, airQuality, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#C5A880] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
        <CloudRain className="w-12 h-12 text-[#B35446] mb-4" />
        <h2 className="text-xl font-editorial font-bold mb-2 text-[#1C1917]">Atmospheric Sensor Offline</h2>
        <p className="text-sm text-[#786E65]">{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  const currentTemp = Math.round(weather.main?.temp || 0);
  const feelsLike = Math.round(weather.main?.feels_like || 0);
  const description = weather.weather?.[0]?.description;

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const dailyForecast = forecast?.list ? forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5) : [];

  const aqiVal = airQuality?.list?.[0]?.main?.aqi;
  const components = airQuality?.list?.[0]?.components;
  const aqiStatus = aqiVal !== undefined && aqiVal !== null ? getAQIStatus(aqiVal, components) : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
      
      {/* Header Chronometer Strip */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-[#C5A880]/20"
      >
        <div>
          <span className="text-[10px] font-roman tracking-[0.25em] text-[#8C6D3F] uppercase block mb-1">
            STATION TELEMETRY · SPEC 4.2
          </span>
          <h1 className="text-4xl md:text-5xl font-editorial font-bold text-[#1C1917] tracking-tight">
            {weather.name}
          </h1>
          <p className="text-sm text-[#57493A] capitalize mt-1 font-medium flex items-center gap-2">
            <span>{description}</span>
            <span className="text-[#C5A880]">•</span>
            {aqiStatus ? (
              <span className="inline-flex items-center gap-1.5">
                AQI: <span className="font-bold text-[#8C6D3F]">{aqiStatus.value}</span> ({aqiStatus.label})
              </span>
            ) : 'Atmospheric air quality nominal'}
          </p>
        </div>

        <div className="text-right">
          <div className="text-6xl md:text-7xl font-editorial font-bold text-[#1C1917] tracking-tight">
            {currentTemp}°
          </div>
          <p className="text-xs font-roman tracking-wider text-[#786E65] uppercase">
            Feels Like {feelsLike}°C
          </p>
        </div>
      </motion.div>

      {/* 3D Meteorological Complications Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-10">
        
        {/* UV Index Dial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="luxury-card-3d p-6 rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF5ED] border border-[#C5A880]/30 flex items-center justify-center mb-3 text-[#B89758]">
            <ThermometerSun className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-roman tracking-widest text-[#786E65] uppercase mb-1">UV RADIANCE</div>
          <div className="text-2xl font-editorial font-bold text-[#1C1917]">7.0 · HIGH</div>
        </motion.div>

        {/* 3D Wind Compass Complication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="luxury-card-3d p-4 rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <LuxuryCompass3D deg={weather.wind?.deg || 0} speed={weather.wind?.speed || 0} />
        </motion.div>

        {/* Humidity Complication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="luxury-card-3d p-6 rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF5ED] border border-[#C5A880]/30 flex items-center justify-center mb-3 text-[#B89758]">
            <Droplets className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-roman tracking-widest text-[#786E65] uppercase mb-1">HUMIDITY</div>
          <div className="text-2xl font-editorial font-bold text-[#1C1917]">{weather.main?.humidity}%</div>
        </motion.div>

        {/* Pressure Complication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="luxury-card-3d p-6 rounded-3xl flex flex-col items-center justify-center text-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF5ED] border border-[#C5A880]/30 flex items-center justify-center mb-3 text-[#B89758]">
            <Gauge className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-roman tracking-widest text-[#786E65] uppercase mb-1">BAROMETRIC</div>
          <div className="text-2xl font-editorial font-bold text-[#1C1917]">{weather.main?.pressure} hPa</div>
        </motion.div>

        {/* Air Quality Index Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="luxury-card-3d p-6 rounded-3xl flex flex-col items-center justify-center text-center col-span-2 lg:col-span-1"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF5ED] border border-[#C5A880]/30 flex items-center justify-center mb-3 text-[#B89758]">
            <Wind className="w-5 h-5" />
          </div>
          <div className="text-[10px] font-roman tracking-widest text-[#786E65] uppercase mb-1">AIR QUALITY (AQI)</div>
          {aqiStatus ? (
            <div className="flex flex-col items-center">
              <span className="text-2xl font-editorial font-bold text-[#1C1917]">{aqiStatus.value}</span>
              <span className="text-[9px] font-roman uppercase tracking-wider px-2.5 py-0.5 mt-1 rounded-full bg-[#FAF5ED] border border-[#C5A880]/40 text-[#8C6D3F]">
                {aqiStatus.label}
              </span>
            </div>
          ) : (
            <span className="text-xs text-[#786E65]">Nominal</span>
          )}
        </motion.div>
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: 5-Day Forecast & Environmental Analytics */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 5-Day Forecast Meteorological Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="luxury-panel p-6 md:p-8 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#C5A880]/20">
              <h2 className="text-lg font-editorial font-bold text-[#1C1917] flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#B89758]" />
                Five-Day Meteorological Trajectory
              </h2>
              <span className="text-[10px] font-roman text-[#786E65] tracking-widest uppercase">
                CALIBRATED DAILY
              </span>
            </div>

            <div className="space-y-3">
              {dailyForecast.map((day, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 hover:bg-white border border-[#C5A880]/20 hover:border-[#B89758]/50 transition-all shadow-sm"
                >
                  <div className="w-32 font-roman text-xs text-[#1C1917] tracking-wider">
                    {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="icon" className="w-8 h-8 opacity-80" />
                    <span className="capitalize text-xs text-[#57493A] font-medium hidden sm:block w-36">
                      {day.weather[0].description}
                    </span>
                  </div>
                  <div className="font-editorial text-xl font-bold text-[#1C1917] w-16 text-right">
                    {Math.round(day.main.temp)}°
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Environmental Telemetry & Pollutant Diagnostics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="luxury-panel p-6 md:p-8 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#C5A880]/20">
              <h2 className="text-lg font-editorial font-bold text-[#1C1917] flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#B89758]" />
                Atmospheric Air Diagnostics
              </h2>
              <span className="text-[10px] font-roman text-[#786E65] tracking-widest uppercase">
                EPA BENCHMARK
              </span>
            </div>

            {aqiStatus ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-roman text-[#57493A] uppercase tracking-wider">AQI Index Meter</span>
                    <span className="text-sm font-bold text-[#8C6D3F]">{aqiStatus.value} / 300</span>
                  </div>
                  <div className="relative h-2 w-full bg-[#FAF5ED] rounded-full border border-[#C5A880]/30 overflow-hidden mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((aqiStatus.value / 300) * 100, 100)}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#DFCCA6] to-[#B89758] rounded-full"
                    />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/80 border border-[#C5A880]/25 shadow-sm">
                    <span className="text-[9px] font-roman text-[#8C6D3F] uppercase tracking-[0.2em] block mb-1 font-bold">
                      HEALTH ADVISORY:
                    </span>
                    <p className="text-xs text-[#57493A] leading-relaxed">
                      {aqiStatus.recommendation}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#C5A880]/25 shadow-sm flex flex-col justify-between">
                    <span className="text-[9px] font-roman text-[#786E65] uppercase tracking-wider mb-1">PM2.5</span>
                    <span className="text-base font-editorial font-bold text-[#1C1917]">
                      {components?.pm2_5 !== undefined ? `${components.pm2_5} μg/m³` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#C5A880]/25 shadow-sm flex flex-col justify-between">
                    <span className="text-[9px] font-roman text-[#786E65] uppercase tracking-wider mb-1">PM10</span>
                    <span className="text-base font-editorial font-bold text-[#1C1917]">
                      {components?.pm10 !== undefined ? `${components.pm10} μg/m³` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#C5A880]/25 shadow-sm flex flex-col justify-between">
                    <span className="text-[9px] font-roman text-[#786E65] uppercase tracking-wider mb-1">CARBON MONOXIDE</span>
                    <span className="text-base font-editorial font-bold text-[#1C1917]">
                      {components?.co !== undefined ? `${(components.co / 1000).toFixed(2)} mg/m³` : 'N/A'}
                    </span>
                  </div>
                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#C5A880]/25 shadow-sm flex flex-col justify-between">
                    <span className="text-[9px] font-roman text-[#786E65] uppercase tracking-wider mb-1">OZONE (O3)</span>
                    <span className="text-base font-editorial font-bold text-[#1C1917]">
                      {components?.o3 !== undefined ? `${components.o3} μg/m³` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#786E65]">Atmospheric air telemetry nominal.</p>
            )}
          </motion.div>
        </div>

        {/* Right Column: 3D Celestial Solar/Lunar Complication & AI Insights */}
        <div className="space-y-8">
          
          {/* 3D Sun & Moon Celestial Complication */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
            className="luxury-panel p-6 rounded-3xl"
          >
            <span className="text-[10px] font-roman tracking-[0.2em] text-[#786E65] uppercase block mb-1">
              HOROLOGICAL COMPLICATION
            </span>
            <h2 className="text-lg font-editorial font-bold text-[#1C1917] mb-2">
              Celestial Solar Arc
            </h2>

            {/* 3D Celestial Arc Canvas */}
            <LuxuryCelestialTrack3D 
              sunrise={weather.sys?.sunrise} 
              sunset={weather.sys?.sunset} 
            />

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#C5A880]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5ED] border border-[#C5A880]/30 flex items-center justify-center text-[#C68A4C]">
                  <Sunrise className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-roman text-[#786E65] uppercase block">SUNRISE</span>
                  <span className="text-xs font-bold text-[#1C1917]">
                    {weather.sys?.sunrise ? formatTime(weather.sys.sunrise) : '6:00 AM'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FAF5ED] border border-[#C5A880]/30 flex items-center justify-center text-[#8C6D3F]">
                  <Sunset className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-roman text-[#786E65] uppercase block">SUNSET</span>
                  <span className="text-xs font-bold text-[#1C1917]">
                    {weather.sys?.sunset ? formatTime(weather.sys.sunset) : '7:30 PM'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Intelligence Briefing Plaque */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
            className="luxury-panel-champagne p-6 rounded-3xl relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#B89758]" />
              <h2 className="text-sm font-roman tracking-wider text-[#1C1917] uppercase font-bold">
                Atelier AI Insights
              </h2>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/80 border border-[#C5A880]/25 shadow-sm text-xs text-[#443E38] leading-relaxed">
                <span className="font-roman text-[9px] text-[#8C6D3F] uppercase block mb-1 font-bold">CURRENT SYNOPSIS:</span>
                {`Temperature sits at ${currentTemp}°C with ${description} in ${weather.name}. Expect highs around ${Math.round(weather.main?.temp_max || currentTemp)}°C across daylight hours.`}
              </div>

              {aqiStatus && (
                <div className="p-3.5 rounded-2xl bg-white/80 border border-[#C5A880]/25 shadow-sm text-xs text-[#443E38] leading-relaxed">
                  <span className="font-roman text-[9px] text-[#8C6D3F] uppercase block mb-1 font-bold">AIR RECEPTIVITY:</span>
                  {`AQI registered at ${aqiStatus.value} (${aqiStatus.label}). ${aqiStatus.recommendation}`}
                </div>
              )}
            </div>
          </motion.div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
