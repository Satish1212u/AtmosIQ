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
      className="luxury-panel p-6 rounded-3xl border border-[#C5A880]/30 bg-[#FAF8F5]/90 shadow-[0_20px_50px_rgba(28,25,23,0.06)] overflow-hidden relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-[#C5A880]/20 pb-3">
        <div className="flex items-center gap-2.5">
          <CloudRain className="w-4 h-4 text-[#5B7B88]" />
          <h3 className="text-xs font-roman uppercase tracking-[0.2em] text-[#1C1917] font-semibold">Precipitation Probability Arc</h3>
        </div>
        <span className="text-[10px] font-roman uppercase tracking-widest text-[#5B7B88] bg-[#F5EFEB] px-2.5 py-1 rounded-full border border-[#C5A880]/30 font-medium">
          PoP % Index
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* SVG Bar Chart */}
        <div className="md:col-span-2 overflow-x-auto no-scrollbar">
          <div className="min-w-[300px]">
            <svg className="w-full h-auto overflow-visible" viewBox={`0 0 ${width} ${height}`}>
              
              {/* Horizontal Guidelines */}
              <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(197,168,128,0.15)" strokeDasharray="3 3" />
              <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(197,168,128,0.15)" strokeDasharray="3 3" />
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(197,168,128,0.25)" />

              {/* Dynamic Columns */}
              {points.map((p, idx) => (
                <g key={idx} className="group/bar cursor-pointer">
                  {/* Outline Pillar */}
                  <motion.rect
                    x={p.x - 7}
                    y={p.y}
                    width="14"
                    height={p.barHeight}
                    rx="7"
                    fill="url(#luxuryPrecipGradient)"
                    initial={{ height: 0, y: height - padding }}
                    animate={{ height: p.barHeight, y: p.y }}
                    transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.08 }}
                  />

                  {/* Intersecting Percentage Indicator */}
                  <text
                    x={p.x}
                    y={p.y - 8}
                    textAnchor="middle"
                    fill="#5B7B88"
                    className="text-[10px] font-serif font-medium opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300 select-none"
                  >
                    {Math.round(p.probability)}%
                  </text>

                  {/* Horizontal Timeline label */}
                  <text
                    x={p.x}
                    y={height - 2}
                    textAnchor="middle"
                    fill="#786C62"
                    className="text-[9px] font-sans uppercase tracking-wider select-none font-medium"
                  >
                    {p.time}
                  </text>
                </g>
              ))}

              <defs>
                <linearGradient id="luxuryPrecipGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C5A880" />
                  <stop offset="100%" stopColor="#5B7B88" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Real-time Risk Assessment */}
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border relative overflow-hidden backdrop-blur-sm ${
            peakEvent.probability > 50
              ? 'bg-[#C7873D]/10 border-[#C7873D]/30'
              : 'bg-[#657953]/10 border-[#657953]/30'
          }`}>
            <div className="flex gap-3">
              {peakEvent.probability > 50 ? (
                <AlertTriangle className="w-5 h-5 text-[#C7873D] shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-[#657953] shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-[10px] text-[#786C62] font-roman uppercase tracking-[0.15em] block mb-1 font-semibold">
                  Precipitation Risk
                </span>
                <p className="text-[12px] text-[#2A2421] font-sans leading-relaxed">
                  {peakEvent.probability > 50 
                    ? `Precipitation threat peak detected at ${peakEvent.time} (${Math.round(peakEvent.probability)}% chance). Carrying a storm shield/umbrella is advised.`
                    : `Negligible rain risk detected (Max ${Math.round(peakEvent.probability)}% at ${peakEvent.time}). Exterior movement unhindered.`
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
