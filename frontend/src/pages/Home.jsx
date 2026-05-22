import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CloudLightning, Bot, MapPin, ArrowRight, Wind, Droplets, Sun, Moon, CloudRain, Sunrise, Sunset, Activity, Mic, Zap, BarChart3, Globe2 } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { getAQIStatus } from '../utils/aqiUtils';
import FloatingTelemetry from '../animations/FloatingTelemetry';
import CityHeroImage from '../components/CityHeroImage';

const Home = () => {
  const { weather, airQuality, requestLocation, loading, locationError } = useWeather();
  const navigate = useNavigate();
  const [aiText, setAiText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleAllowLocation = () => {
    requestLocation();
  };

  const condition = weather?.weather?.[0]?.main || 'Clear';
  const temp = weather ? Math.round(weather.main?.temp) : 0;
  const isNight = weather?.weather?.[0]?.icon?.includes('n');
  const country = weather?.sys?.country || '';

  // AI recommendations logic
  const aiRecommendations = useMemo(() => {
    if (!weather) return [];

    const aqiVal = airQuality?.list?.[0]?.main?.aqi;
    const components = airQuality?.list?.[0]?.components;
    const aqiStatus = aqiVal !== undefined && aqiVal !== null ? getAQIStatus(aqiVal, components) : null;
    const aqiText = aqiStatus ? `AQI is ${aqiStatus.value} (${aqiStatus.label}) - ${aqiStatus.recommendation}` : 'Air quality data currently unavailable.';

    if (condition === 'Rain' || condition === 'Drizzle') return [`Heavy rain detected. Best to stay indoors. ☔. ${aqiText}`, 'Carry an umbrella if heading out.', 'Perfect time for a hot coffee. ☕'];
    if (condition === 'Clear' && !isNight) return [`UV index might be high. Wear sunscreen. ☀️. ${aqiText}`, 'Perfect weather for an outdoor run!', 'Clear skies ahead for the next 4 hours.'];
    if (isNight) return [`Clear night ahead. Good conditions for stargazing. ✨. ${aqiText}`, 'Temperatures dropping, grab a jacket if heading out.', 'Quiet evening detected.'];
    return [`Stable conditions detected. ${aqiText}`, 'Great time for a workout. 🏃‍♂️', `AQI Status: ${aqiStatus ? aqiStatus.label : 'Good'}`];
  }, [condition, weather, isNight, airQuality]);

  useEffect(() => {
    if (weather) {
      setIsTyping(true);
      let currentText = "";
      const textToType = aiRecommendations[0];
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
      }, 50);
      return () => clearInterval(typingInterval);
    }
  }, [weather, aiRecommendations]);

  if (loading) {
    return (
      <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 overflow-hidden bg-transparent">
        <div className="relative flex items-center justify-center w-40 h-40 mb-8">
          <motion.div animate={{ scale: [1, 2, 1], opacity: [0.1, 0.5, 0.1] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="absolute inset-0 bg-cyan-500/30 rounded-full blur-2xl" />
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute w-24 h-24 rounded-full border-t-4 border-l-4 border-cyan-400 border-r-transparent border-b-transparent" />
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute w-32 h-32 rounded-full border-b-2 border-r-2 border-blue-500 border-l-transparent border-t-transparent" />
          <img
            src="/logo.png"
            alt="AtmosIQ Logo"
            className="w-16 h-16 absolute z-10 animate-pulse drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] object-contain scale-110"
          />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 tracking-tight text-glow animate-pulse">
          Loading AtmosIQ...
        </h2>
        <p className="text-slate-400 mt-4 font-medium animate-pulse">Fetching your local weather data</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 overflow-hidden bg-transparent">
        {/* Animated Mesh Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, type: "spring", stiffness: 40 }}
          className="z-10 flex flex-col items-center text-center max-w-3xl mx-auto glass-dark p-10 md:p-14 rounded-[3rem] shadow-[0_0_80px_rgba(56,189,248,0.15)] relative overflow-hidden backdrop-blur-2xl border border-white/10 group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-3xl bg-slate-950/70 border border-cyan-500/40 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(56,189,248,0.4)] relative z-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-cyan-500/10 rounded-3xl blur animate-pulse-slow"></div>
            <img
              src="/logo.png"
              alt="AtmosIQ Logo"
              className="w-14 h-14 object-contain relative z-10 scale-125"
            />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1] text-white drop-shadow-2xl">
            AI-Powered <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 text-glow-cyan">Climate Intelligence.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-100 mb-12 leading-relaxed max-w-xl font-semibold">
            AtmosIQ uses real-time weather data and AI to give you accurate forecasts, air quality insights, and personalized recommendations — all in one beautiful interface.
          </p>

          {locationError && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-orange-400 mb-8 bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20 max-w-md backdrop-blur-md">
              <p className="font-bold text-orange-300 mb-1 flex items-center justify-center gap-2"><MapPin className="w-4 h-4" /> Location Access Denied</p>
              <p className="text-sm">Search for a city manually using the top bar to continue.</p>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center relative z-10">
            <motion.button
              onClick={handleAllowLocation} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="magnetic-btn w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:shadow-[0_0_50px_rgba(56,189,248,0.8)] border border-cyan-400/50 text-lg tracking-wide"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-shimmer skew-x-12"></span>
              <MapPin className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Allow Location Access</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Heading options based on weather
  const getPremiumHeading = () => {
    if (condition === 'Rain') return "Rain in the Forecast Today";
    if (condition === 'Clear' && !isNight) return "Clear Skies at Your Location";
    if (isNight) return "Clear Night Ahead";
    if (condition === 'Clouds') return "Partly Cloudy Conditions";
    return "Your Local Weather";
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 xl:px-24 overflow-hidden gap-12 lg:gap-20 z-10 bg-transparent">

      {/* ══ CITY HERO BACKGROUND ══
          Full-screen cinematic animated climate backdrops and dynamic particle
          systems synchronized with current weather condition. */}
      <div className="absolute inset-0 z-0">
        <CityHeroImage
          city={weather.name}
          country={country}
          condition={condition}
          isNight={isNight}
          className="w-full h-full"
        />
      </div>

      {/* Mesh glow behind the main content */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-[1] animate-blob"></div>

      {/* Futuristic Ambient Climate Telemetry HUD */}
      <FloatingTelemetry />

      {/* Left Content - AI & CTA */}
      <motion.div
        initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "easeOut" }}
        className="flex-1 flex flex-col items-start text-left max-w-2xl relative z-10 w-full mt-10 lg:mt-0"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-dark mb-8 text-sm font-bold text-cyan-300 border-cyan-400/40 backdrop-blur-xl shadow-[0_0_20px_rgba(56,189,248,0.2)]"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
          <span className="tracking-widest uppercase text-xs">Live · {weather.name}</span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter mb-4 leading-[1.05] text-white drop-shadow-2xl">
          {getPremiumHeading().split(' ').map((word, i) => (
            <span key={i} className={i % 2 === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500" : ""}>{word} </span>
          ))}
        </h1>

        {/* AI Typing Banner */}
        <div className="glass-dark border-l-4 border-cyan-500 px-6 py-4 rounded-2xl mb-10 w-full max-w-xl backdrop-blur-xl shadow-lg mt-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-50 group-hover:opacity-100 transition-opacity"><Bot className="w-5 h-5 text-cyan-400" /></div>
          <p className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" /> AI Analysis
          </p>
          <p className="text-lg text-slate-200 font-medium min-h-[28px] flex items-center">
            {aiText}
            {isTyping && <span className="inline-block w-2 h-5 bg-cyan-400 ml-1 animate-pulse"></span>}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="magnetic-btn w-full px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] border border-transparent"
            >
              <BarChart3 className="w-5 h-5" />
              Launch Dashboard
            </motion.button>
          </Link>

          <Link to="/assistant" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="magnetic-btn w-full px-8 py-4 rounded-2xl glass-dark font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-colors border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] hover:border-cyan-400/50"
            >
              <Mic className="w-5 h-5 text-cyan-400 group-hover:animate-pulse" />
              AI Assistant
              <ArrowRight className="w-4 h-4 ml-2 opacity-50" />
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Right Content - Advanced Live Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: 15 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1.2, type: "spring", stiffness: 50 }}
        style={{ perspective: 1000 }}
        className="flex-1 flex justify-center lg:justify-end w-full relative z-10"
      >
        <motion.div
          animate={{ y: [-15, 15, -15] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="glass-dark rounded-[2.5rem] p-8 lg:p-10 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl w-full max-w-lg relative overflow-hidden group"
        >
          {/* Card Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/30 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-400/40 transition-colors duration-500"></div>

          <div className="relative z-10 flex justify-between items-start mb-6">
            <div>
              <p className="text-slate-300 font-extrabold tracking-wide uppercase text-xs mb-2">Weather Now</p>
              <h2 className="text-4xl font-extrabold text-white flex items-center gap-2">
                {weather.name}
              </h2>
            </div>
            <motion.img
              animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}
              src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@4x.png`}
              alt="Weather Icon"
              className="w-28 h-28 -mt-8 -mr-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
            />
          </div>

          <div className="relative z-10 mb-8 flex items-end gap-4">
            <div className="text-8xl md:text-9xl font-black tracking-tighter text-white drop-shadow-lg leading-none">
              {temp}
            </div>
            <div className="pb-3">
              <span className="text-5xl text-cyan-400 block leading-none font-bold">°C</span>
              <p className="text-sm text-slate-200 capitalize mt-2 font-bold bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 inline-block">{weather.weather?.[0]?.description}</p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="bg-slate-950/75 rounded-2xl p-4 flex flex-col justify-between border border-white/10 hover:border-cyan-400/40 transition-colors shadow-inner group/card">
              <div className="flex items-center gap-2 mb-2">
                <CloudLightning className="w-5 h-5 text-cyan-400 group-hover/card:scale-110 transition-transform" />
                <p className="text-xs text-slate-300 font-extrabold uppercase tracking-wider">Feels Like</p>
              </div>
              <p className="text-2xl font-bold text-white">{Math.round(weather.main?.feels_like)}°C</p>
            </div>
            <div className="bg-slate-950/75 rounded-2xl p-4 flex flex-col justify-between border border-white/10 hover:border-blue-400/40 transition-colors shadow-inner group/card">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-5 h-5 text-blue-400 group-hover/card:scale-110 transition-transform" />
                <p className="text-xs text-slate-300 font-extrabold uppercase tracking-wider">Wind (m/s)</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-white">{Math.round(weather.wind?.speed || 0)}</p>
                <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center bg-white/10" style={{ transform: `rotate(${weather.wind?.deg}deg)` }}>
                  <ArrowRight className="w-4 h-4 text-slate-300 -rotate-90" />
                </div>
              </div>
            </div>
            <div className="bg-slate-950/75 rounded-2xl p-4 flex items-center justify-between border border-white/10 hover:border-orange-400/40 transition-colors shadow-inner group/card col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-xl">
                  <Sunrise className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-300 font-extrabold uppercase">Sunrise</p>
                  <p className="text-lg font-bold text-white">{new Date(weather.sys?.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/15"></div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-xs text-slate-300 font-extrabold uppercase">Sunset</p>
                  <p className="text-lg font-bold text-white">{new Date(weather.sys?.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="p-2 bg-indigo-500/20 rounded-xl">
                  <Sunset className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Mini Map/Radar Widget */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: 50 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 1, type: "spring" }}
          className="absolute -bottom-6 -right-6 lg:-right-10 glass-dark p-1.5 rounded-[1.5rem] border-cyan-400/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl flex items-center justify-center hover:scale-105 transition-transform cursor-pointer group z-20"
          onClick={() => navigate('/radar')}
        >
          <div className="w-32 h-32 rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" alt="Radar Map" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">Live Radar</p>
              </div>
            </div>
            {/* Radar Sweep Effect */}
            <div className="absolute top-1/2 left-1/2 w-full h-full origin-top-left -translate-x-1/2 -translate-y-1/2 border-l border-cyan-400/50 bg-gradient-to-r from-cyan-400/20 to-transparent animate-[spin_4s_linear_infinite]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Home;
