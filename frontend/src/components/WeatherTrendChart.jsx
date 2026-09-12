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
      className="luxury-panel p-6 rounded-3xl border border-[#C5A880]/30 bg-[#FAF8F5]/90 shadow-[0_20px_50px_rgba(28,25,23,0.06)] relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-[#C5A880]/20 pb-3">
        <div className="flex items-center gap-2.5">
          <Thermometer className="w-4 h-4 text-[#8C6D3B]" />
          <h3 className="text-xs font-roman uppercase tracking-[0.2em] text-[#1C1917] font-semibold">24-Hour Thermal Trajectory</h3>
        </div>
        <span className="text-[10px] font-roman uppercase tracking-widest text-[#8C6D3B] bg-[#F5EFEB] px-2.5 py-1 rounded-full border border-[#C5A880]/30 font-medium">
          Diurnal Curve
        </span>
      </div>

      {/* Interactive Responsive SVG Wrapper */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="min-w-[450px]">
          <svg className="w-full h-auto overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <linearGradient id="glowTempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C5A880" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#C5A880" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(197,168,128,0.15)" strokeDasharray="3 3" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(197,168,128,0.15)" strokeDasharray="3 3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(197,168,128,0.25)" />

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
              stroke="#B89758"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />

            {/* Coordinate Points and Value Bubbles */}
            {points.map((p, idx) => (
              <g key={idx} className="group/dot cursor-pointer">
                {/* Gold Dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  className="fill-[#FAF8F5] stroke-[#B89758] stroke-2"
                />
                {/* Outer interactive halo */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="rgba(197,168,128,0.2)"
                  className="opacity-0 hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Peak temperature reading above points */}
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  fill="#1C1917"
                  className="text-[11px] font-serif font-medium select-none"
                >
                  {Math.round(p.temp)}°
                </text>

                {/* Timeline Axis Labels (Hour) */}
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
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherTrendChart;
