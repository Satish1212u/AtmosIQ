import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, AlertTriangle, ShieldCheck } from 'lucide-react';

const RainProbabilityGraph = ({ rainChance }) => {
  if (!rainChance || rainChance.length === 0) return null;

  // SVG grid config
  const width = 500;
  const height = 150;
  const padding = 20;

  const points = rainChance.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / (rainChance.length - 1);
    const probability = Math.min(Math.max(d.chance, 0), 100);
    // Map probability percentage to SVG height (higher = taller bars)
    const barHeight = ((probability) * (height - padding * 2)) / 100;
    const y = height - padding - barHeight;
    return { x, y, barHeight, probability, ...d };
  });

  // Calculate highest precipitation probability day/time
  const peakEvent = points.reduce((prev, current) => 
    (prev.probability > current.probability) ? prev : current
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 border border-white/10 bg-slate-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-blue-400 animate-bounce" style={{ animationDuration: '3s' }} />
          <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Precipitation Forecast</h3>
        </div>
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
          Pop Probability %
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* SVG Neon Bar Chart */}
        <div className="md:col-span-2 overflow-x-auto no-scrollbar">
          <div className="min-w-[300px]">
            <svg className="w-full h-auto overflow-visible" viewBox={`0 0 ${width} ${height}`}>
              
              {/* Horizontal Guidelines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" />

              {/* Dynamic Columns */}
              {points.map((p, idx) => (
                <g key={idx} className="group/bar cursor-pointer">
                  {/* Glowing Outline Pillar */}
                  <motion.rect
                    x={p.x - 8}
                    y={p.y}
                    width="16"
                    height={p.barHeight}
                    rx="8"
                    fill="url(#neonBlueGradient)"
                    className="drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                    initial={{ height: 0, y: height - padding }}
                    animate={{ height: p.barHeight, y: p.y }}
                    transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.08 }}
                  />

                  {/* Intersecting Percentage Indicator */}
                  <text
                    x={p.x}
                    y={p.y - 8}
                    textAnchor="middle"
                    fill="#3b82f6"
                    className="text-[9px] font-black font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300 select-none"
                  >
                    {Math.round(p.probability)}%
                  </text>

                  {/* Horizontal Timeline label */}
                  <text
                    x={p.x}
                    y={height - 2}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.4)"
                    className="text-[8px] font-bold font-mono uppercase tracking-wider select-none"
                  >
                    {p.time}
                  </text>
                </g>
              ))}

              <defs>
                <linearGradient id="neonBlueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Real-time Risk Assessment */}
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border relative overflow-hidden backdrop-blur-md ${
            peakEvent.probability > 50
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div className="flex gap-3">
              {peakEvent.probability > 50 ? (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-[10px] text-slate-200 font-extrabold uppercase tracking-widest block mb-1">
                  Precipitation Risk
                </span>
                <p className="text-[12px] text-white font-semibold leading-relaxed">
                  {peakEvent.probability > 50 
                    ? `Precipitation threat peak detected at ${peakEvent.time} (${Math.round(peakEvent.probability)}% chance). Carrying a storm shield/umbrella is advised.`
                    : `Negligible rain risk detected (Max ${Math.round(peakEvent.probability)}% at ${peakEvent.time}). Outdoor movement recommended.`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default RainProbabilityGraph;
