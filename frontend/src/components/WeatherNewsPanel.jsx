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
      icon: <Sun className="w-5 h-5 text-[#C5A880]" />,
      iconBg: "bg-[#C5A880]/10 border-[#C5A880]/30",
      title: "Solar Radiance Protocol",
      tip: "Even under diffuse overcast, solar UV penetrates atmospheric layers. Apply broad-spectrum protection when engaging in exterior pursuits.",
    },
    {
      id: 2,
      icon: <Droplets className="w-5 h-5 text-[#5B7B88]" />,
      iconBg: "bg-[#5B7B88]/10 border-[#5B7B88]/30",
      title: "Hydration Equilibrium",
      tip: "Elevated temperature and ambient humidity accelerate trans-epidermal fluid depletion. Maintain regular cellular hydration throughout the diurnal arc.",
    },
    {
      id: 3,
      icon: <Wind className="w-5 h-5 text-[#657953]" />,
      iconBg: "bg-[#657953]/10 border-[#657953]/30",
      title: "Atmospheric Timing",
      tip: "Diurnal inversion layers typically clear by mid-morning. Calibrate exterior physical exertion to early intervals for pristine particulate indices.",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[#C5A880]/20 pb-3">
        <Lightbulb className="w-4 h-4 text-[#8C6D3B]" />
        <h3 className="text-xs font-roman uppercase tracking-[0.2em] text-[#1C1917] font-semibold">Curated Climatological Protocols</h3>
      </div>

      {/* Tips list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tips.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.1 }}
            className="luxury-panel p-5 rounded-2xl border border-[#C5A880]/25 bg-[#FAF8F5]/90 hover:border-[#C5A880]/60 transition-all duration-300 flex flex-col gap-3 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${item.iconBg}`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[11px] font-roman text-[#1C1917] uppercase tracking-[0.15em] mb-1.5 font-semibold">{item.title}</p>
              <p className="text-[13px] text-[#786C62] font-sans leading-relaxed">{item.tip}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeatherNewsPanel;
