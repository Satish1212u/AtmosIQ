import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CloudLightning, Bot, MapPin, ArrowRight, Wind, Sun, 
  Sunrise, Sunset, Sparkles, BarChart3, Mic, Compass 
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { getAQIStatus } from '../utils/aqiUtils';
import FloatingTelemetry from '../animations/FloatingTelemetry';
import LuxuryAtmosphereGlobe from '../components/3d/LuxuryAtmosphereGlobe';

const Home = () => {
  const { weather, airQuality, requestLocation, loading, locationError } = useWeather();
  const navigate = useNavigate();
  const [aiText, setAiText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleAllowLocation = () => {
    requestLocation();
  };

  const condition = weather?.weather?.[0]?.main || 'Clear';
  const temp = weather ? Math.round(weather.main?.temp) : 22;
  const isNight = weather?.weather?.[0]?.icon?.includes('n');

  // AI recommendations logic
  const aiRecommendations = useMemo(() => {
    if (!weather) return [];

    const aqiVal = airQuality?.list?.[0]?.main?.aqi;
    const components = airQuality?.list?.[0]?.components;
    const aqiStatus = aqiVal !== undefined && aqiVal !== null ? getAQIStatus(aqiVal, components) : null;
    const aqiText = aqiStatus ? `AQI is ${aqiStatus.value} (${aqiStatus.label}) - ${aqiStatus.recommendation}` : 'Atmospheric air quality within nominal thresholds.';

    if (condition === 'Rain' || condition === 'Drizzle') return [`Precipitation detected in your region. ${aqiText}`, 'Carry a waterproof mantle if stepping out.', 'Ideal atmospheric conditions for indoor contemplation.'];
    if (condition === 'Clear' && !isNight) return [`Solar radiance elevated. UV protection recommended. ${aqiText}`, 'Exceptional atmospheric clarity for travel and outdoor pursuits.', 'Clear horizon sustained across the upcoming 4 hours.'];
    if (isNight) return [`Crystalline celestial sky. Optimal visibility for astronomical observation. ${aqiText}`, 'Ambient temperature declining; layer accordingly.', 'Quiet atmospheric stillness detected.'];
    return [`Atmospheric equilibrium sustained. ${aqiText}`, 'Favorable meteorological metrics across all vectors.', `Atmospheric AQI: ${aqiStatus ? aqiStatus.label : 'Nominal'}`];
  }, [condition, weather, isNight, airQuality]);

  useEffect(() => {
    if (weather) {
      setIsTyping(true);
      let currentText = "";
      const textToType = aiRecommendations[0] || "Atmospheric intelligence synchronized.";
      let i = 0;
      setAiText("");
      const typingInterval = setInterval(() => {
        if (i < textToType.length) {
          currentText += textToType.charAt(i);
          setAiText(currentText);
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 35);
      return () => clearInterval(typingInterval);
    }
  }, [weather, aiRecommendations]);

  // Loading Screen (Luxury Atelier Aesthetic)
  if (loading) {
    return (
      <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 overflow-hidden bg-transparent">
        <div className="relative flex items-center justify-center w-40 h-40 mb-8">
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
            className="absolute inset-0 bg-[#C5A880]/20 rounded-full blur-2xl" 
          />
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }} 
            className="absolute w-24 h-24 rounded-full border-t-2 border-l-2 border-[#B89758] border-r-transparent border-b-transparent" 
          />
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }} 
            className="absolute w-32 h-32 rounded-full border-b border-r border-[#C5A880]/50 border-l-transparent border-t-transparent" 
          />
          <img
            src="/logo.png"
            alt="AtmosIQ Logo"
            className="w-12 h-12 absolute z-10 object-contain drop-shadow-md"
          />
        </div>
        <h2 className="text-2xl md:text-3xl font-editorial font-bold text-[#1C1917] tracking-wider">
          CALIBRATING ATMOSPHERIC SENSORS...
        </h2>
        <p className="text-[#786E65] mt-3 text-xs font-roman tracking-[0.2em] uppercase">
          Synchronizing Real-Time Telemetry Arrays
        </p>
      </div>
    );
  }

  // Location Access Prompt Screen
  if (!weather) {
    return (
      <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 overflow-hidden bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="z-10 flex flex-col items-center text-center max-w-2xl mx-auto luxury-panel p-10 md:p-14 rounded-[2.5rem] relative overflow-hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.04, 1] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-2xl bg-[#FAF8F5] border border-[#C5A880]/40 flex items-center justify-center mb-8 shadow-sm relative z-10"
          >
            <img
              src="/logo.png"
              alt="AtmosIQ Logo"
              className="w-12 h-12 object-contain"
            />
          </motion.div>

          <span className="text-[11px] font-roman tracking-[0.25em] text-[#8C6D3F] uppercase mb-3">
            ATELIER EDITION · NO. 01
          </span>

          <h1 className="text-4xl md:text-6xl font-editorial font-bold tracking-tight mb-6 text-[#1C1917] leading-[1.1]">
            Spatial Climate <br />
            <span className="italic font-normal text-[#B89758]">Intelligence.</span>
          </h1>

          <p className="text-base md:text-lg text-[#57493A] mb-10 leading-relaxed max-w-lg font-normal">
            AtmosIQ orchestrates hyper-local meteorological telemetry, live air quality diagnostics, and conversational AI advisory into a refined spatial experience.
          </p>

          {locationError && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-[#8C4A20] mb-8 bg-[#FAF0E6] p-4 rounded-2xl border border-[#E8C4A2] max-w-md text-xs font-medium">
              <p className="font-bold mb-1 flex items-center justify-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Geographic Access Restricted</p>
              <p>You may use the navigation search bar to specify any global destination.</p>
            </motion.div>
          )}

          <motion.button
            onClick={handleAllowLocation} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="luxury-gold-btn px-9 py-4 rounded-full font-bold flex items-center justify-center gap-3 text-sm tracking-wide shadow-md"
          >
            <MapPin className="w-4 h-4" />
            <span>Enable Local Telemetry</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const getEditorialHeading = () => {
    if (condition === 'Rain') return "Precipitation in Your Horizon";
    if (condition === 'Clear' && !isNight) return "Crystalline Solar Conditions";
    if (isNight) return "Celestial Atmospheric Stillness";
    if (condition === 'Clouds') return "Layered Atmospheric Cloud Strata";
    return "Local Atmospheric Telemetry";
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-center justify-between px-6 lg:px-14 xl:px-20 overflow-hidden gap-12 lg:gap-14 z-10 bg-transparent py-10">
      
      {/* 3D Horological Floating Telemetry Nodes */}
      <FloatingTelemetry />

      {/* Left Column: Editorial Headline, 3D Globe Teaser, and AI Advisory */}
      <motion.div
        initial={{ opacity: 0, x: -40 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col items-start text-left max-w-2xl relative z-10 w-full"
      >
        {/* Status Chip */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/85 border border-[#C5A880]/30 mb-6 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B89758] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B89758]"></span>
          </span>
          <span className="text-[10px] font-roman tracking-[0.2em] text-[#786E65] uppercase">
            LIVE TELEMETRY · {weather.name}
          </span>
        </div>

        {/* Editorial Serif Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-editorial font-bold tracking-tight mb-4 text-[#1C1917] leading-[1.08]">
          {getEditorialHeading().split(' ').map((word, i) => (
            <span key={i} className={i % 2 === 1 ? "text-[#B89758] italic font-normal" : ""}>
              {word}{' '}
            </span>
          ))}
        </h1>

        {/* AI Typing Advisory Banner */}
        <div className="luxury-panel border-l-2 border-[#B89758] px-6 py-4 rounded-2xl mb-8 w-full max-w-xl shadow-sm relative overflow-hidden mt-3">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-roman tracking-[0.2em] text-[#8C6D3F] uppercase flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#B89758]" /> Atmospheric Intelligence
            </p>
            <Bot className="w-4 h-4 text-[#B89758]/60" />
          </div>
          <p className="text-sm md:text-base text-[#443E38] font-medium min-h-[30px] leading-relaxed">
            {aiText}
            {isTyping && <span className="inline-block w-1.5 h-4 bg-[#B89758] ml-1 animate-pulse"></span>}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="luxury-gold-btn w-full px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2.5 text-xs font-roman tracking-wider"
            >
              <BarChart3 className="w-4 h-4" />
              EXPLORE DASHBOARD
            </motion.button>
          </Link>

          <Link to="/assistant" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              className="luxury-ghost-btn w-full px-8 py-3.5 rounded-full font-bold flex items-center justify-center gap-2.5 text-xs font-roman tracking-wider"
            >
              <Mic className="w-4 h-4 text-[#B89758]" />
              AI ASSISTANT
              <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-60" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Center/Right Column: Three.js Interactive 3D Globe & Weather Complication */}
      <div className="flex-1 flex flex-col items-center lg:items-end justify-center w-full relative z-10 gap-6">
        
        {/* Three.js Interactive Atmospheric Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md flex items-center justify-center"
        >
          <LuxuryAtmosphereGlobe 
            condition={condition}
            temp={temp}
            city={weather.name}
            className="w-full aspect-square"
          />
        </motion.div>

        {/* Physical Meteorological Chronometer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.4 }}
          className="luxury-card-3d rounded-3xl p-6 md:p-8 w-full max-w-md relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] font-roman text-[#786E65] tracking-[0.2em] uppercase block mb-1">
                STATION CHRONOMETER
              </span>
              <h2 className="text-2xl font-editorial font-bold text-[#1C1917]">
                {weather.name}
              </h2>
            </div>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
              alt="Condition"
              className="w-14 h-14 -mt-2 -mr-2 object-contain opacity-85"
            />
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-6xl md:text-7xl font-editorial font-bold text-[#1C1917] tracking-tight">
              {temp}°
            </span>
            <div className="text-xs text-[#57493A] font-medium capitalize">
              <span className="text-[#8C6D3F] font-bold block">{weather.weather?.[0]?.description}</span>
              Feels like {Math.round(weather.main?.feels_like)}°C
            </div>
          </div>

          {/* Micro-complications Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#C5A880]/20">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 border border-[#C5A880]/20">
              <Wind className="w-4 h-4 text-[#B89758]" />
              <div>
                <span className="text-[9px] font-roman text-[#786E65] uppercase block">WIND SPEED</span>
                <span className="text-xs font-bold text-[#1C1917]">{Math.round(weather.wind?.speed || 0)} m/s</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/70 border border-[#C5A880]/20">
              <Sunrise className="w-4 h-4 text-[#C68A4C]" />
              <div>
                <span className="text-[9px] font-roman text-[#786E65] uppercase block">SUNRISE</span>
                <span className="text-xs font-bold text-[#1C1917]">
                  {new Date(weather.sys?.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Mini Radar Interactive Preview Link */}
          <div 
            onClick={() => navigate('/radar')}
            className="mt-4 pt-3 flex items-center justify-between border-t border-[#C5A880]/15 cursor-pointer group"
          >
            <span className="text-[10px] font-roman tracking-wider text-[#6B5E51] group-hover:text-[#B89758] transition-colors flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#B89758]" /> OPEN GEOSPATIAL RADAR TERMINAL
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B89758] group-hover:translate-x-1 transition-transform" />
          </div>
        </motion.div>

      </div>

    </div>
  );
};

export default Home;
