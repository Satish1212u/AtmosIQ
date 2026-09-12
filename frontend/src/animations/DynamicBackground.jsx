import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtmosphere } from '../hooks/useAtmosphere';
import LuxurySpatialAtmosphere from '../components/3d/LuxurySpatialAtmosphere';

/**
 * DynamicBackground
 * 
 * Luxury 3D Spatial Atmospheric Canvas.
 * Employs warm ivory, champagne, soft beige, and alabaster tones with
 * an active Three.js real-time spatial atmospheric system.
 */
const DynamicBackground = ({ children }) => {
  const atmosphere = useAtmosphere();
  const { condition, windSpeed, aqiLevel, humidityLevel, isNight } = atmosphere;

  // LAYER 1: Luxury Palette Atmosphere (Warm Ivory / Champagne / Soft Beige / Deep Espresso Obsidian)
  const getBackgroundClass = () => {
    switch (condition) {
      case 'rain':
      case 'drizzle':
        return 'bg-gradient-to-b from-[#F2EDE4] via-[#E8E2D6] to-[#DCD3C3]';
      case 'thunderstorm':
        return 'bg-gradient-to-b from-[#211E1B] via-[#2D2824] to-[#1C1815]';
      case 'snow':
        return 'bg-gradient-to-b from-[#FAF8F5] via-[#F3ECE0] to-[#EAE0D0]';
      case 'fog':
      case 'mist':
      case 'haze':
        return 'bg-gradient-to-b from-[#F0EAE1] via-[#E6DDD1] to-[#D8CEBF]';
      case 'heat':
        return 'bg-gradient-to-b from-[#FAF4EC] via-[#F4E9D8] to-[#EAD5BA]';
      case 'night':
        return 'bg-gradient-to-b from-[#181513] via-[#24201C] to-[#141210]';
      case 'clouds':
        return 'bg-gradient-to-b from-[#F4EFE6] via-[#EAE3D5] to-[#DFD6C5]';
      case 'clear':
      default:
        return isNight 
          ? 'bg-gradient-to-b from-[#181513] via-[#24201C] to-[#141210]'
          : 'bg-gradient-to-b from-[#FAF8F5] via-[#F5EFEB] to-[#EAE2D3]';
    }
  };

  const isDarkCondition = condition === 'thunderstorm' || condition === 'night' || isNight;

  return (
    <div className={`min-h-screen w-full relative overflow-hidden transition-colors duration-[2500ms] ease-out ${getBackgroundClass()} z-0 ${isDarkCondition ? 'text-[#FAF8F5]' : 'text-[#1C1917]'}`}>
      
      {/* LAYER 1.5: Three.js Unified 3D Spatial Atmosphere Engine */}
      <LuxurySpatialAtmosphere 
        condition={condition} 
        windSpeed={windSpeed} 
        isNight={isDarkCondition}
        aqiLevel={aqiLevel}
      />

      {/* LAYER 2: Ambient Auric Lighting Scatters */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        {/* Soft Golden Sunlight Bloom */}
        {!isDarkCondition && (
          <div 
            className="absolute -top-[15%] right-[-5%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-[#DFCCA6]/25 to-transparent blur-[140px]" 
          />
        )}

        {/* Ambient Champagne Radiance */}
        <div 
          className="absolute -bottom-[20%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tr from-[#C5A880]/15 to-transparent blur-[150px]" 
        />
      </div>

      {/* LAYER 3: Cinematic Atmospheric Storm Lighting (Restrained and sophisticated) */}
      <AnimatePresence>
        {condition === 'thunderstorm' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.45, 0, 0, 0.7, 0.1, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
              times: [0, 0.4, 0.42, 0.45, 0.8, 0.82, 0.85, 0.9]
            }}
            className="absolute inset-0 bg-[#FFF8ED] mix-blend-overlay pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* LAYER 4: High Humidity Tactile Condensation */}
      {humidityLevel === 'high' && (
        <div className="absolute inset-0 backdrop-blur-[1px] bg-white/[0.04] z-10 pointer-events-none" />
      )}

      {/* LAYER 5: Application Content */}
      <div className="relative z-20 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default DynamicBackground;
