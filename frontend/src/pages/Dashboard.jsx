import React from 'react';
import { Bot } from "lucide-react";
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import {
  ThermometerSun, Droplets, Wind, Gauge,
  Sun, Sunset, CloudRain, Sunrise, Eye
} from 'lucide-react';
import { getAQIStatus } from '../utils/aqiUtils';

const Dashboard = () => {
  const { weather, forecast, airQuality, loading, error, city } = useWeather();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
        <CloudRain className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
        <p className="text-white/70">{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  const currentTemp = Math.round(weather.main?.temp || 0);
  const feelsLike = Math.round(weather.main?.feels_like || 0);
  const condition = weather.weather?.[0]?.main;
  const description = weather.weather?.[0]?.description;
  const iconCode = weather.weather?.[0]?.icon;

  // Format times
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Group forecast by day
  const dailyForecast = forecast?.list ? forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5) : [];

  const MetricCard = ({ icon, label, value, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 transition-colors shadow-inner"
    >
      <div className="text-cyan-300 mb-3">{icon}</div>
      <div className="text-[11px] text-slate-300 font-extrabold uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-black text-white">{value}</div>
    </motion.div>
  );

  const aqiVal = airQuality?.list?.[0]?.main?.aqi;
  const components = airQuality?.list?.[0]?.components;
  const aqiStatus = aqiVal !== undefined && aqiVal !== null ? getAQIStatus(aqiVal, components) : null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 text-white">{weather.name}</h1>
          <p className="text-lg text-slate-200 capitalize font-semibold">
            {description} • {aqiStatus ? (
              <span className="inline-flex items-center gap-1.5 ml-1">
                AQI: <span className={`${aqiStatus.color} font-black text-glow-cyan`}>{aqiStatus.value}</span> ({aqiStatus.label})
              </span>
            ) : 'Air quality data currently unavailable.'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-6xl md:text-7xl font-black text-white">{currentTemp}°</div>
          <p className="text-slate-300 font-extrabold">Feels like {feelsLike}°</p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8">
        <MetricCard icon={<ThermometerSun className="w-8 h-8" />} label="UV Index" value="High (7)" delay={0.1} />
        <MetricCard icon={<Wind className="w-8 h-8" />} label="Wind Speed" value={`${weather.wind?.speed} km/h`} delay={0.2} />
        <MetricCard icon={<Droplets className="w-8 h-8" />} label="Humidity" value={`${weather.main?.humidity}%`} delay={0.3} />
        <MetricCard icon={<Gauge className="w-8 h-8" />} label="Pressure" value={`${weather.main?.pressure} hPa`} delay={0.4} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors relative overflow-hidden group border border-white/10 hover:border-cyan-500/40 shadow-inner"
        >
          <div className="text-cyan-300 mb-3"><Wind className="w-8 h-8 animate-pulse" /></div>
          <div className="text-[11px] text-slate-300 font-extrabold uppercase tracking-wider mb-1">Air Quality (AQI)</div>
          <div className="text-xl font-bold flex flex-col items-center">
            {aqiStatus ? (
              <>
                <span className={`${aqiStatus.color} text-2xl font-black`}>{aqiStatus.value}</span>
                <span className={`text-[10px] mt-2.5 px-3 py-1 rounded-full ${aqiStatus.bg} ${aqiStatus.color} border ${aqiStatus.border} font-black uppercase tracking-wide shadow-md`}>
                  {aqiStatus.label}
                </span>
              </>
            ) : (
              <span className="text-sm text-white/40">Unavailable</span>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: 5-Day Forecast */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-400" />
              5-Day Forecast
            </h2>
            <div className="space-y-4">
              {dailyForecast.map((day, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-colors">
                  <div className="w-28 font-extrabold text-white text-[15px]">
                    {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="icon" className="w-10 h-10" />
                    <span className="capitalize text-slate-200 font-semibold text-sm hidden sm:block w-32">{day.weather[0].description}</span>
                  </div>
                  <div className="font-extrabold text-white text-lg w-16 text-right">{Math.round(day.main.temp)}°</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Environmental Insights Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-3xl p-6 md:p-8"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-cyan-400" />
              Environmental Insights
            </h2>
            {aqiStatus ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-extrabold text-slate-200">AQI Progress Indicator</span>
                    <span className={`text-sm font-black ${aqiStatus.color}`}>{aqiStatus.value} / 300</span>
                  </div>
                  <div className="relative h-3 w-full bg-white/10 rounded-full border border-white/5 p-[1px] mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((aqiStatus.value / 300) * 100, 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${aqiStatus.barColor}`}
                      style={{ boxShadow: `0 0 10px ${aqiStatus.hex}` }}
                    />
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/70 border border-white/10 p-4 rounded-2xl">
                    <span className="font-bold text-white block mb-1 text-xs uppercase tracking-widest text-cyan-400">Advisory:</span>
                    {aqiStatus.recommendation}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/60 hover:bg-slate-950/80 p-3.5 rounded-2xl border border-white/10 transition-all flex flex-col justify-between">
                    <span className="text-[10px] text-slate-300 block font-black uppercase tracking-wider mb-1">PM2.5</span>
                    <span className="text-base font-black text-glow text-white">{components?.pm2_5 !== undefined ? `${components.pm2_5} μg/m³` : 'N/A'}</span>
                  </div>
                  <div className="bg-slate-950/60 hover:bg-slate-950/80 p-3.5 rounded-2xl border border-white/10 transition-all flex flex-col justify-between">
                    <span className="text-[10px] text-slate-300 block font-black uppercase tracking-wider mb-1">PM10</span>
                    <span className="text-base font-black text-glow text-white">{components?.pm10 !== undefined ? `${components.pm10} μg/m³` : 'N/A'}</span>
                  </div>
                  <div className="bg-slate-950/60 hover:bg-slate-950/80 p-3.5 rounded-2xl border border-white/10 transition-all flex flex-col justify-between">
                    <span className="text-[10px] text-slate-300 block font-black uppercase tracking-wider mb-1">CO</span>
                    <span className="text-base font-black text-glow text-white">{components?.co !== undefined ? `${(components.co / 1000).toFixed(2)} mg/m³` : 'N/A'}</span>
                  </div>
                  <div className="bg-slate-950/60 hover:bg-slate-950/80 p-3.5 rounded-2xl border border-white/10 transition-all flex flex-col justify-between">
                    <span className="text-[10px] text-slate-300 block font-black uppercase tracking-wider mb-1">O3</span>
                    <span className="text-base font-black text-glow text-white">{components?.o3 !== undefined ? `${components.o3} μg/m³` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-300 font-semibold text-sm">Air quality data currently unavailable.</p>
            )}
          </motion.div>
        </div>

        {/* Right Column: Sun & Extras */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-3xl p-6"
          >
            <h2 className="text-lg font-bold mb-4">Sun & Moon</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/25 flex items-center justify-center border border-orange-500/30">
                  <Sunrise className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-300 font-extrabold uppercase tracking-wider">Sunrise</div>
                  <div className="text-2xl font-black text-white">{weather.sys?.sunrise ? formatTime(weather.sys.sunrise) : '6:00 AM'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/25 flex items-center justify-center border border-purple-500/30">
                  <Sunset className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-300 font-extrabold uppercase tracking-wider">Sunset</div>
                  <div className="text-2xl font-black text-white">{weather.sys?.sunset ? formatTime(weather.sys.sunset) : '7:30 PM'}</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-3xl p-6 bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border-cyan-500/40 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-300 animate-pulse" />
                AI Insights
              </h2>
              <div className="space-y-3">
                <div className="text-sm text-slate-200 font-semibold leading-relaxed bg-slate-950/70 border border-white/10 p-3.5 rounded-2xl shadow-inner">
                  <span className="font-extrabold block text-cyan-300 mb-1 text-[11px] uppercase tracking-wider">Current Conditions:</span>
                  {`It's currently ${currentTemp}°C and ${description} in ${weather.name}. Expect highs around ${Math.round(weather.main?.temp_max || currentTemp)}°C today.`}
                </div>
                {aqiStatus ? (
                  <div className="text-sm text-slate-200 font-semibold leading-relaxed bg-slate-950/70 border border-white/10 p-3.5 rounded-2xl shadow-inner">
                    <span className="font-extrabold block text-lime-300 mb-1 text-[11px] uppercase tracking-wider">Air Quality:</span>
                    {`AQI is ${aqiStatus.value} (${aqiStatus.label}). ${aqiStatus.recommendation}`}
                  </div>
                ) : (
                  <div className="text-sm text-orange-200 font-semibold bg-orange-950/75 border border-orange-500/30 p-3.5 rounded-2xl">
                    Air quality data is currently unavailable. Consider standard respiratory precautions when outdoors.
                  </div>
                )}
              </div>
            </div>
            <Bot className="absolute -right-6 -bottom-6 w-24 h-24 text-cyan-400/10 pointer-events-none" />
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
