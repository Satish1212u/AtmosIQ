import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Zap } from 'lucide-react';

const WeatherTrendChart = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  // Find max and min temperatures for perfect adaptive bounds mapping
  const temps = hourlyData.map(d => d.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const tempRange = maxTemp - minTemp === 0 ? 1 : maxTemp - minTemp;

  // SVG dimensions
  const width = 500;
  const height = 150;
  const padding = 20;

  // Map data coordinates to SVG space
  const points = hourlyData.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / (hourlyData.length - 1);
    // Invert Y coordinate so higher temperatures go UP
    const y = height - padding - ((d.temp - minTemp) * (height - padding * 2)) / tempRange;
    return { x, y, ...d };
  });

  // Assemble path string
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  // Area path fading to bottom
  const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 border border-white/10 bg-slate-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Thermal Trajectory</h3>
        </div>
        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          24H Timeline
        </span>
      </div>

      {/* Interactive Responsive SVG Wrapper */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="min-w-[450px]">
          <svg className="w-full h-auto overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="glowTempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" />

            {/* Gradient Filled Area */}
            <motion.path
              d={areaData}
              fill="url(#glowTempGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />

            {/* Line Path */}
            <motion.path
              d={pathData}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            />

            {/* Coordinate Points and Value Bubbles */}
            {points.map((p, idx) => (
              <g key={idx} className="group/dot cursor-pointer">
                {/* Glow Dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  className="fill-cyan-400 stroke-slate-950 stroke-2 drop-shadow-[0_0_6px_#22d3ee]"
                />
                {/* Outer interactive halo */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="rgba(34,211,238,0.15)"
                  className="opacity-0 hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Peak temperature reading above points */}
                <text
                  x={p.x}
                  y={p.y - 12}
                  textAnchor="middle"
                  fill="#ffffff"
                  className="text-[10px] font-black font-mono select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  {Math.round(p.temp)}°
                </text>

                {/* Timeline Axis Labels (Hour) */}
                <text
                  x={p.x}
                  y={height - 2}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.5)"
                  className="text-[8px] font-bold font-mono uppercase tracking-wider select-none"
                >
                  {p.time}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherTrendChart;
