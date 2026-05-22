import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Heart, Wind } from 'lucide-react';

const AQIGauge = ({ aqiData }) => {
  if (!aqiData) return null;

  const { aqiValue = 1, label = 'Good', suggestion = '', pm2_5 = 12, pm10 = 24 } = aqiData;

  // Colors & levels based on standard 1-5 AQI index
  const aqiConfigs = {
    1: { color: 'text-emerald-400', stroke: '#10b981', glow: 'shadow-emerald-500/20', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    2: { color: 'text-yellow-400', stroke: '#eab308', glow: 'shadow-yellow-500/20', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    3: { color: 'text-orange-400', stroke: '#f97316', glow: 'shadow-orange-500/20', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    4: { color: 'text-rose-400', stroke: '#f43f5e', glow: 'shadow-rose-500/20', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
    5: { color: 'text-purple-400', stroke: '#a855f7', glow: 'shadow-purple-500/20', bg: 'bg-purple-500/10', border: 'border-purple-500/30' }
  };

  const config = aqiConfigs[aqiValue] || aqiConfigs[1];
  
  // Calculate SVG arc rotation percentage
  const percentage = Math.min((aqiValue / 5) * 100, 100);
  const strokeDashoffset = 251.2 - (251.2 * (percentage * 0.5)) / 100; // Half circle math

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`glass rounded-3xl p-6 border ${config.border} bg-slate-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
        <Wind className="w-5 h-5 text-cyan-400 animate-pulse" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Atmospheric Quality Assessment</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Animated Radial Gauge */}
        <div className="flex flex-col items-center justify-center relative">
          <svg className="w-44 h-28 transform overflow-visible" viewBox="0 0 100 50">
            {/* Background Arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Active Gauge Arc */}
            <motion.path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={config.stroke}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="125.6"
              initial={{ strokeDashoffset: 125.6 }}
              animate={{ strokeDashoffset: 125.6 - (125.6 * (aqiValue / 5)) }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              className="drop-shadow-[0_0_8px_var(--tw-shadow-color)]"
              style={{ shadowColor: config.stroke }}
            />
          </svg>

          {/* Central AQI Meter Reading */}
          <div className="absolute bottom-2 text-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="block text-4xl font-black font-mono tracking-tighter text-white"
            >
              Lvl {aqiValue}
            </motion.span>
            <span className={`text-xs font-black uppercase tracking-wider ${config.color}`}>
              {label} Index
            </span>
          </div>
        </div>

        {/* Suggestion & Pollutant Breakdown */}
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border ${config.border} ${config.bg} relative overflow-hidden backdrop-blur-md`}>
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-200 font-extrabold uppercase tracking-widest block mb-1">Health Directive</span>
                <p className="text-[13px] text-white font-medium leading-relaxed">{suggestion}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3 shadow-inner hover:border-cyan-400/50 transition-colors duration-300">
              <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest block mb-1">PM 2.5 Density</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white font-mono">{pm2_5}</span>
                <span className="text-[9px] text-slate-400 font-bold font-mono">µg/m³</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3 shadow-inner hover:border-cyan-400/50 transition-colors duration-300">
              <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest block mb-1">PM 10 Density</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white font-mono">{pm10}</span>
                <span className="text-[9px] text-slate-400 font-bold font-mono">µg/m³</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AQIGauge;
