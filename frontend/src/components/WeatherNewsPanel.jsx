import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Droplets, Thermometer, Wind, Sun } from 'lucide-react';

/**
 * WeatherTipsPanel — replaces the old fake "Climate Feed & Alerts" section.
 * Shows simple, useful weather tips that feel helpful and natural.
 */
const WeatherNewsPanel = ({ news }) => {
  const tips = [
    {
      id: 1,
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      iconBg: "bg-amber-500/10 border-amber-500/20",
      title: "UV Protection",
      tip: "Even on cloudy days, UV rays can reach your skin. Apply SPF 30+ sunscreen when spending time outdoors for more than 20 minutes.",
    },
    {
      id: 2,
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      iconBg: "bg-blue-500/10 border-blue-500/20",
      title: "Stay Hydrated",
      tip: "In warm or humid weather, your body loses fluids faster. Aim for at least 8 glasses of water throughout the day to stay energized.",
    },
    {
      id: 3,
      icon: <Wind className="w-5 h-5 text-cyan-400" />,
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
      title: "Air Quality Tip",
      tip: "When AQI is elevated, early mornings typically have cleaner air. Schedule outdoor workouts before 9 AM to minimize pollution exposure.",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <Lightbulb className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Weather Tips</h3>
      </div>

      {/* Tips list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tips.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.1 }}
            className="glass rounded-2xl p-4 border border-white/10 bg-slate-950/40 hover:border-cyan-500/30 hover:bg-slate-950/60 transition-all duration-300 flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">{item.title}</p>
              <p className="text-[13px] text-white/80 font-medium leading-relaxed">{item.tip}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeatherNewsPanel;
