import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, AlertCircle, Shirt, CloudRain, Activity } from 'lucide-react';

const ClimateInsightPanel = ({ insights }) => {
  if (!insights) return null;

  // Destructure insight categories
  const {
    travelSafety = "Conditions are suitable for travel. Roads and routes appear clear.",
    outdoorRecommendation = "Great conditions for outdoor activities today.",
    healthAdvisory = "Air quality is safe. No respiratory concerns detected.",
    clothingSuggestion = "Dress comfortably for the current temperature.",
    rainRisk = "No rain expected. An umbrella is not needed."
  } = insights;

  const panels = [
    {
      title: "Travel Advisory",
      desc: travelSafety,
      icon: <Compass className="w-5 h-5 text-cyan-400" />,
      color: "border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-400/60",
      labelColor: "text-cyan-400"
    },
    {
      title: "Outdoor Activity",
      desc: outdoorRecommendation,
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
      color: "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-400/60",
      labelColor: "text-emerald-400"
    },
    {
      title: "Health & Air Quality",
      desc: healthAdvisory,
      icon: <Activity className="w-5 h-5 text-rose-400" />,
      color: "border-rose-500/30 bg-rose-500/5 hover:border-rose-400/60",
      labelColor: "text-rose-400"
    },
    {
      title: "What to Wear",
      desc: clothingSuggestion,
      icon: <Shirt className="w-5 h-5 text-amber-400" />,
      color: "border-amber-500/30 bg-amber-500/5 hover:border-amber-400/60",
      labelColor: "text-amber-400"
    },
    {
      title: "Precipitation Forecast",
      desc: rainRisk,
      icon: <CloudRain className="w-5 h-5 text-blue-400" />,
      color: "border-blue-500/30 bg-blue-500/5 hover:border-blue-400/60",
      labelColor: "text-blue-400"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Panel Header */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <AlertCircle className="w-5 h-5 text-cyan-400" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Weather Insights</h3>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {panels.map((panel, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ scale: 1.01 }}
            className={`glass rounded-2xl p-4 border transition-all duration-300 backdrop-blur-md relative overflow-hidden flex gap-4 ${panel.color} ${idx === 4 ? 'sm:col-span-2' : ''}`}
          >
            {/* Icon Column */}
            <div className="w-10 h-10 rounded-xl bg-slate-950/60 flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
              {panel.icon}
            </div>

            {/* Content Column */}
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${panel.labelColor}`}>
                {panel.title}
              </span>
              <p className="text-[13px] text-white font-medium leading-relaxed">
                {panel.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ClimateInsightPanel;
