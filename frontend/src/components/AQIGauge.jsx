import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Heart, Wind } from 'lucide-react';

const AQIGauge = ({ aqiData }) => {
  if (!aqiData) return null;

  const { aqiValue = 1, label = 'Good', suggestion = '', pm2_5 = 12, pm10 = 24 } = aqiData;

  // Colors & levels based on standard 1-5 AQI index
  const aqiConfigs = {
    1: { color: 'text-[#657953]', stroke: '#657953', bg: 'bg-[#657953]/10', border: 'border-[#657953]/30' },
    2: { color: 'text-[#C5A880]', stroke: '#C5A880', bg: 'bg-[#C5A880]/10', border: 'border-[#C5A880]/30' },
    3: { color: 'text-[#C7873D]', stroke: '#C7873D', bg: 'bg-[#C7873D]/10', border: 'border-[#C7873D]/30' },
    4: { color: 'text-[#B85743]', stroke: '#B85743', bg: 'bg-[#B85743]/10', border: 'border-[#B85743]/30' },
    5: { color: 'text-[#7D4D73]', stroke: '#7D4D73', bg: 'bg-[#7D4D73]/10', border: 'border-[#7D4D73]/30' }
  };

  const config = aqiConfigs[aqiValue] || aqiConfigs[1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`luxury-panel p-6 rounded-3xl border ${config.border} shadow-[0_20px_50px_rgba(28,25,23,0.06)] overflow-hidden relative group`}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6 border-b border-[#C5A880]/20 pb-3">
        <Wind className="w-4 h-4 text-[#8C6D3B]" />
        <h3 className="text-xs font-roman uppercase tracking-[0.2em] text-[#1C1917] font-semibold">Atmospheric Purity Index</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Animated Radial Gauge */}
        <div className="flex flex-col items-center justify-center relative py-2">
          <svg className="w-44 h-28 transform overflow-visible" viewBox="0 0 100 50">
            {/* Background Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="rgba(197, 168, 128, 0.2)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Active Gauge Arc */}
            <motion.path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={config.stroke}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="125.6"
              initial={{ strokeDashoffset: 125.6 }}
              animate={{ strokeDashoffset: 125.6 - (125.6 * (aqiValue / 5)) }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            />
          </svg>

          {/* Central AQI Meter Reading */}
          <div className="absolute bottom-1 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="block text-3xl font-serif font-light tracking-tight text-[#1C1917]"
            >
              Lvl {aqiValue}
            </motion.span>
            <span className={`text-[10px] font-roman uppercase tracking-[0.15em] font-semibold ${config.color}`}>
              {label} Purity
            </span>
          </div>
        </div>

        {/* Suggestion & Pollutant Breakdown */}
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${config.border} ${config.bg} relative overflow-hidden backdrop-blur-sm`}>
            <div className="flex items-start gap-3">
              <Heart className="w-4 h-4 text-[#9E6554] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-[#786C62] font-roman uppercase tracking-[0.15em] block mb-1 font-semibold">Health Advisory</span>
                <p className="text-[13px] text-[#2A2421] font-sans leading-relaxed">{suggestion}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#FAF8F5]/90 border border-[#C5A880]/20 rounded-xl p-3 shadow-sm hover:border-[#C5A880]/50 transition-colors duration-300">
              <span className="text-[9px] text-[#786C62] font-roman uppercase tracking-widest block mb-1 font-medium">PM 2.5 Density</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-serif text-[#1C1917]">{pm2_5}</span>
                <span className="text-[9px] text-[#786C62] font-sans">µg/m³</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5]/90 border border-[#C5A880]/20 rounded-xl p-3 shadow-sm hover:border-[#C5A880]/50 transition-colors duration-300">
              <span className="text-[9px] text-[#786C62] font-roman uppercase tracking-widest block mb-1 font-medium">PM 10 Density</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-serif text-[#1C1917]">{pm10}</span>
                <span className="text-[9px] text-[#786C62] font-sans">µg/m³</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AQIGauge;
