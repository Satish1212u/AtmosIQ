import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sun, CloudRain, Cloud, CloudLightning, CloudSnow, Wind } from 'lucide-react';

const WeatherForecastCard = ({ forecastList }) => {
  if (!forecastList || forecastList.length === 0) return null;

  const getWeatherIcon = (condition = 'clear') => {
    const term = condition.toLowerCase();
    if (term.includes('rain') || term.includes('drizzle')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (term.includes('storm') || term.includes('thunder')) return <CloudLightning className="w-8 h-8 text-purple-400" />;
    if (term.includes('snow') || term.includes('ice')) return <CloudSnow className="w-8 h-8 text-sky-200 animate-pulse" />;
    if (term.includes('clear') || term.includes('sun')) return <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" style={{ animationDuration: '20s' }} />;
    return <Cloud className="w-8 h-8 text-slate-300" />;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <Calendar className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">5-Day Meteorological Trajectory</h3>
      </div>

      {/* Forecast list */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {forecastList.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1, ease: 'easeOut' }}
            whileHover={{ scale: 1.03, y: -4 }}
            className="glass rounded-2xl p-4 border border-white/10 bg-slate-950/60 backdrop-blur-2xl hover:border-cyan-400/40 hover:shadow-[0_15px_30px_rgba(34,211,238,0.15)] flex flex-col items-center justify-between text-center relative group overflow-hidden transition-all duration-300 shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {/* Day Title */}
            <span className="text-[11px] text-slate-300 font-extrabold uppercase tracking-widest mb-2 font-mono block">
              {item.day}
            </span>

            {/* Condition Icon */}
            <div className="my-3 relative">
              <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-xl scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              {getWeatherIcon(item.condition)}
            </div>

            {/* Temps */}
            <div className="flex flex-col gap-0.5 mt-2">
              <span className="text-xl font-black text-white font-mono">
                {Math.round(item.tempMax)}°
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold font-mono">
                {Math.round(item.tempMin)}° Min
              </span>
            </div>

            {/* Micro Weather Tag */}
            <span className="text-[9px] text-cyan-400 font-extrabold uppercase tracking-wider mt-3 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 w-full truncate block">
              {item.condition}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecastCard;
