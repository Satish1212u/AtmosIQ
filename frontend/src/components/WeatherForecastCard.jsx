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
      <div className="flex items-center gap-2.5 border-b border-[#C5A880]/20 pb-3">
        <Calendar className="w-4 h-4 text-[#8C6D3B]" />
        <h3 className="text-xs font-roman uppercase tracking-[0.2em] text-[#1C1917] font-semibold">5-Day Meteorological Trajectory</h3>
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
            className="luxury-panel p-4 rounded-2xl border border-[#C5A880]/25 bg-[#FAF8F5]/90 hover:border-[#C5A880]/60 hover:shadow-[0_15px_30px_rgba(197,168,128,0.15)] flex flex-col items-center justify-between text-center relative group overflow-hidden transition-all duration-300 shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#C5A880]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {/* Day Title */}
            <span className="text-[10px] text-[#786C62] font-roman uppercase tracking-[0.2em] mb-2 font-medium block">
              {item.day}
            </span>

            {/* Condition Icon */}
            <div className="my-3 relative">
              <div className="absolute inset-0 bg-[#C5A880]/15 rounded-full blur-lg scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              {getWeatherIcon(item.condition)}
            </div>

            {/* Temps */}
            <div className="flex flex-col gap-0.5 mt-2">
              <span className="text-2xl font-serif font-light text-[#1C1917]">
                {Math.round(item.tempMax)}°
              </span>
              <span className="text-[11px] text-[#786C62] font-sans font-medium">
                {Math.round(item.tempMin)}° Min
              </span>
            </div>

            {/* Micro Weather Tag */}
            <span className="text-[9px] text-[#8C6D3B] font-medium uppercase tracking-wider mt-3 px-2 py-0.5 rounded-full bg-[#F5EFEB] border border-[#C5A880]/25 w-full truncate block">
              {item.condition}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecastCard;
