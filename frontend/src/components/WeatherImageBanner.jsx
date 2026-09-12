import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Eye, Sun, Zap, CloudFog, CloudRain } from 'lucide-react';

const WeatherImageBanner = ({ condition = 'clear', topic = 'general' }) => {
  const getBannerDetails = () => {
    const term = condition.toLowerCase();
    const activeTopic = topic.toLowerCase();

    if (activeTopic === 'aqi') {
      return {
        title: "Air Quality Overview",
        subtitle: "Real-time air quality monitoring",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
        overlayClass: "bg-gradient-to-t from-orange-500/25 via-yellow-500/10 to-transparent",
        icon: <CloudFog className="w-5 h-5 text-orange-400 animate-pulse" />,
        alertText: "AQI MONITORING ACTIVE"
      };
    }

    if (term.includes('rain') || term.includes('drizzle') || activeTopic === 'rain') {
      return {
        title: "Precipitation Forecast",
        subtitle: "Live rain and precipitation data",
        image: "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?auto=format&fit=crop&w=800&q=80",
        overlayClass: "bg-gradient-to-t from-[#5B7B88]/30 via-[#C5A880]/15 to-transparent",
        icon: <CloudRain className="w-5 h-5 text-[#5B7B88]" />,
        alertText: "RAIN FORECAST ACTIVE"
      };
    }

    if (term.includes('storm') || term.includes('thunder')) {
      return {
        title: "Thunderstorm Alert",
        subtitle: "Active storm conditions in your area",
        image: "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?auto=format&fit=crop&w=800&q=80",
        overlayClass: "bg-gradient-to-t from-purple-500/30 via-pink-500/10 to-transparent animate-pulse",
        icon: <Zap className="w-5 h-5 text-purple-400" />,
        alertText: "STORM WARNING"
      };
    }

    // Default Sunshine
    return {
      title: "UV & Sun Exposure",
      subtitle: "Clear skies · Good visibility",
      image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
      overlayClass: "bg-gradient-to-t from-amber-500/20 via-orange-500/5 to-transparent",
      icon: <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" style={{ animationDuration: '25s' }} />,
      alertText: "CLEAR SKIES"
    };
  };

  const details = getBannerDetails();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-44 rounded-3xl overflow-hidden border border-[#C5A880]/30 relative group shadow-[0_20px_40px_rgba(28,25,23,0.1)]"
    >
      {/* Background Image */}
      <img
        src={details.image}
        alt={details.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out brightness-90"
      />

      {/* Color Overlay */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${details.overlayClass}`} />

      {/* Header Info Tag */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5]/90 border border-[#C5A880]/30 backdrop-blur-md shadow-sm">
          {details.icon}
          <span className="text-[9px] font-roman font-semibold text-[#1C1917] uppercase tracking-[0.15em]">
            {details.alertText}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5]/90 border border-[#C5A880]/30 text-[9px] font-roman uppercase tracking-widest text-[#8C6D3B] backdrop-blur-md shadow-sm font-semibold">
          <Eye className="w-3.5 h-3.5" />
          Telemetry Live
        </div>
      </div>

      {/* Bottom Title Text Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none text-left bg-gradient-to-t from-[#1C1917]/80 via-[#1C1917]/40 to-transparent p-4 rounded-2xl">
        <h3 className="text-base font-serif font-medium text-[#FAF8F5] tracking-wide">
          {details.title}
        </h3>
        <p className="text-[11px] text-[#EDE6DA] font-sans tracking-wide mt-0.5">
          {details.subtitle}
        </p>
      </div>

    </motion.div>
  );
};

export default WeatherImageBanner;
