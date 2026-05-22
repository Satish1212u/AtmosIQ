import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useAtmosphere } from '../hooks/useAtmosphere';

const DynamicBackground = ({ children }) => {
  const atmosphere = useAtmosphere();
  const { condition, windSpeed, aqiLevel, humidityLevel, humidity, temp } = atmosphere;
  const [init, setInit] = useState(false);

  // Initialize tsParticles Engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // LAYER 1: Dynamic Gradient Background (z-0)
  const getBackgroundClass = () => {
    switch (condition) {
      case 'rain':
      case 'drizzle':
        return 'bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155]';
      case 'thunderstorm':
        return 'bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e1b4b]';
      case 'snow':
        return 'bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8]';
      case 'fog':
      case 'mist':
      case 'haze':
        return 'bg-gradient-to-b from-[#475569] via-[#64748b] to-[#94a3b8]';
      case 'heat':
        return 'bg-gradient-to-b from-[#ea580c] via-[#f97316] to-[#fcd34d]';
      case 'night':
        return 'bg-gradient-to-b from-[#020617] via-[#09090b] to-[#172554]';
      case 'clouds':
        return 'bg-gradient-to-b from-[#334155] via-[#475569] to-[#64748b]';
      case 'clear':
      default:
        return 'bg-gradient-to-b from-[#0284c7] via-[#38bdf8] to-[#bae6fd]';
    }
  };

  // LAYER 2: Atmospheric Fog/Clouds & AQI Simulation (z-10)
  const getAtmosphericFog = () => {
    let opacity = 0;
    let color = 'bg-white';
    
    if (condition === 'fog' || condition === 'mist' || condition === 'haze') opacity = 0.5;
    if (condition === 'clouds') opacity = 0.2;
    if (aqiLevel === 'high') {
      opacity = Math.max(opacity, 0.4);
      color = 'bg-amber-900';
    } else if (aqiLevel === 'moderate') {
      opacity = Math.max(opacity, 0.2);
      color = 'bg-amber-700';
    }

    if (opacity === 0) return null;

    const duration = Math.max(20, 100 - (windSpeed * 5)); // Higher wind = faster clouds

    return (
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        className={`absolute top-0 left-0 w-[200%] h-full mix-blend-overlay filter blur-3xl ${color} z-10`}
        style={{ opacity }}
      />
    );
  };

  // LAYER 3: Particles Engine Config (z-10)
  const particlesConfig = useMemo(() => {
    const baseConfig = {
      fullScreen: { enable: false, zIndex: 0 },
      detectRetina: true,
      fpsLimit: 60,
    };

    const isRaining = condition === 'rain' || condition === 'drizzle' || condition === 'thunderstorm';
    
    if (isRaining) {
      const angle = 90 + (windSpeed * 2); // Wind affects rain angle
      return {
        ...baseConfig,
        particles: {
          color: { value: '#ffffff' },
          number: { value: condition === 'thunderstorm' ? 250 : 150, density: { enable: true, value_area: 800 } },
          shape: { type: 'line' },
          opacity: { value: 0.6 },
          size: { value: { min: 1, max: 4 } },
          line_linked: { enable: false },
          move: {
            enable: true,
            speed: condition === 'thunderstorm' ? 40 : 25,
            direction: angle > 110 ? 'bottom-left' : angle < 70 ? 'bottom-right' : 'bottom',
            straight: true,
            outModes: 'out'
          }
        }
      };
    }

    if (condition === 'snow') {
      return {
        ...baseConfig,
        particles: {
          color: { value: '#ffffff' },
          number: { value: 200, density: { enable: true, value_area: 800 } },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.3, max: 0.8 } },
          size: { value: { min: 1, max: 4 } },
          move: {
            enable: true,
            speed: 1 + (windSpeed * 0.2),
            direction: 'bottom',
            straight: false,
            outModes: 'out',
            warp: true
          }
        }
      };
    }

    if (condition === 'night') {
      return {
        ...baseConfig,
        particles: {
          color: { value: '#ffffff' },
          number: { value: 100, density: { enable: true, value_area: 800 } },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.1, max: 0.5 }, anim: { enable: true, speed: 1, sync: false } },
          size: { value: { min: 0.5, max: 1.5 } },
          move: { enable: false } // Stars don't move
        }
      };
    }
    
    if (condition === 'heat') {
      return {
        ...baseConfig,
        particles: {
          color: { value: '#fbbf24' },
          number: { value: 40, density: { enable: true, value_area: 800 } },
          shape: { type: 'circle' },
          opacity: { value: { min: 0.1, max: 0.4 } },
          size: { value: { min: 1, max: 3 } },
          move: {
            enable: true,
            speed: 1,
            direction: 'top',
            straight: false,
            outModes: 'out'
          }
        }
      };
    }

    // Default (Clear / Clouds)
    return {
      ...baseConfig,
      particles: {
        color: { value: '#ffffff' },
        number: { value: 20, density: { enable: true, value_area: 800 } },
        shape: { type: 'circle' },
        opacity: { value: 0.3 },
        size: { value: { min: 1, max: 3 } },
        move: {
          enable: true,
          speed: 0.5 + (windSpeed * 0.1),
          direction: 'none',
          random: true,
          straight: false,
          outModes: 'out'
        }
      }
    };
  }, [condition, windSpeed]);

  return (
    <div className={`min-h-screen w-full relative overflow-hidden transition-colors duration-[3000ms] ease-in-out ${getBackgroundClass()} z-0`}>
      
      {/* LAYER 2: Fog & AQI (z-10) */}
      {getAtmosphericFog()}

      {/* LAYER 4: Lighting & Glow (z-20) */}
      <AnimatePresence>
        {/* Thunderstorm Lightning */}
        {condition === 'thunderstorm' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0, 0.8, 0, 0, 1, 0.2, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
              times: [0, 0.4, 0.42, 0.45, 0.8, 0.82, 0.85, 0.9]
            }}
            className="absolute inset-0 bg-white mix-blend-overlay pointer-events-none z-20"
          />
        )}

        {/* Heatwave / Sun Bloom */}
        {condition === 'heat' && (
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-orange-400 mix-blend-screen filter blur-[150px] pointer-events-none z-20"
          />
        )}
        
        {/* Night Moon Glow */}
        {condition === 'night' && (
          <motion.div
            animate={{ opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-indigo-300 mix-blend-screen filter blur-[100px] pointer-events-none z-20"
          />
        )}
      </AnimatePresence>

      {/* Wet Glass Overlay for Rain (z-10) */}
      {(condition === 'rain' || condition === 'drizzle' || condition === 'thunderstorm') && (
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay z-10 pointer-events-none" />
      )}

      {/* Condensation for high humidity (z-10) */}
      {humidityLevel === 'high' && (
         <div className="absolute inset-0 backdrop-blur-[2px] bg-white/5 z-10 pointer-events-none" />
      )}

      {/* LAYER 3: Particles (z-10, Fullscreen Fixed) */}
      {init && (
        <div className="fixed inset-0 w-full h-full z-10 pointer-events-none">
          <Particles
            id="tsparticles"
            options={particlesConfig}
            className="h-full w-full"
          />
        </div>
      )}

      {/* LAYER 5 & 6: Main UI / Content (z-30+) */}
      <div className="relative z-30 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default DynamicBackground;
