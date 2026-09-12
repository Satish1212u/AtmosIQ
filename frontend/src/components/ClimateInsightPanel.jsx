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
      icon: <Compass className="w-5 h-5 text-[#8C6D3B]" />,
      color: "border-[#C5A880]/30 bg-[#FAF8F5]/80 hover:border-[#C5A880]/60",
      labelColor: "text-[#8C6D3B]"
    },
    {
      title: "Outdoor Activity",
      desc: outdoorRecommendation,
      icon: <Sparkles className="w-5 h-5 text-[#657953]" />,
      color: "border-[#657953]/25 bg-[#FAF8F5]/80 hover:border-[#657953]/50",
      labelColor: "text-[#657953]"
    },
    {
      title: "Health & Air Quality",
      desc: healthAdvisory,
      icon: <Activity className="w-5 h-5 text-[#9E6554]" />,
      color: "border-[#9E6554]/25 bg-[#FAF8F5]/80 hover:border-[#9E6554]/50",
      labelColor: "text-[#9E6554]"
    },
    {
      title: "What to Wear",
      desc: clothingSuggestion,
      icon: <Shirt className="w-5 h-5 text-[#B89758]" />,
      color: "border-[#B89758]/25 bg-[#FAF8F5]/80 hover:border-[#B89758]/50",
      labelColor: "text-[#B89758]"
    },
    {
      title: "Precipitation Forecast",
      desc: rainRisk,
      icon: <CloudRain className="w-5 h-5 text-[#5B7B88]" />,
      color: "border-[#5B7B88]/25 bg-[#FAF8F5]/80 hover:border-[#5B7B88]/50",
      labelColor: "text-[#5B7B88]"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Panel Header */}
      <div className="flex items-center gap-2.5 border-b border-[#C5A880]/20 pb-3">
        <AlertCircle className="w-4 h-4 text-[#8C6D3B]" />
        <h3 className="text-xs font-roman uppercase tracking-[0.2em] text-[#1C1917] font-semibold">Atmospheric Intelligence Briefing</h3>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {panels.map((panel, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ scale: 1.01 }}
            className={`luxury-panel p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex gap-4 shadow-sm ${panel.color} ${idx === 4 ? 'sm:col-span-2' : ''}`}
          >
            {/* Icon Column */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FAF8F5] to-[#EDE6DA] flex items-center justify-center border border-[#C5A880]/30 shrink-0 shadow-sm">
              {panel.icon}
            </div>

            {/* Content Column */}
            <div>
              <span className={`text-[10px] font-roman uppercase tracking-[0.15em] block mb-1 font-semibold ${panel.labelColor}`}>
                {panel.title}
              </span>
              <p className="text-[13px] text-[#2A2421] font-sans leading-relaxed">
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
