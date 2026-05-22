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
        overlayClass: "bg-gradient-to-t from-blue-500/30 via-cyan-500/15 to-transparent",
        icon: <CloudRain className="w-5 h-5 text-cyan-400 animate-bounce" />,
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
      className="w-full h-44 rounded-3xl overflow-hidden border border-white/10 relative group shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
    >
      {/* Background Image */}
      <img
        src={details.image}
        alt={details.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
      />

      {/* Color Overlay */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${details.overlayClass}`} />

      {/* Ambient particles (rain stream effect) */}
      {(condition.toLowerCase().includes('rain') || topic.toLowerCase() === 'rain') && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[1px] h-12 bg-gradient-to-b from-transparent to-cyan-300 rounded"
              style={{
                left: `${15 + i * 16}%`,
                top: `${-20 + (i * 12)}%`,
                animation: `rainDropFall 1.2s linear infinite`,
                animationDelay: `${i * 200}ms`
              }}
            />
          ))}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes rainDropFall {
              0% { transform: translateY(-50px); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateY(220px); opacity: 0; }
            }
          `}} />
        </div>
      )}

      {/* AQI haze effect */}
      {topic.toLowerCase() === 'aqi' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-color-dodge opacity-25">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent blur-3xl animate-pulse" />
        </div>
      )}

      {/* Header Info Tag */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md">
          {details.icon}
          <span className="text-[10px] font-black font-mono text-white uppercase tracking-widest">
            {details.alertText}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-cyan-500/30 text-[9px] font-extrabold uppercase tracking-widest text-cyan-400 backdrop-blur-md">
          <Eye className="w-3.5 h-3.5" />
          Live View
        </div>
      </div>

      {/* Bottom Title Text Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none text-left">
        <h3 className="text-base font-black text-white uppercase tracking-wider font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {details.title}
        </h3>
        <p className="text-[11px] text-slate-300 font-bold tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] mt-0.5">
          {details.subtitle}
        </p>
      </div>

    </motion.div>
  );
};

export default WeatherImageBanner;
