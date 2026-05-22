import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mic, MicOff, Zap, CloudSun, Send, Bot, Sparkles,
  FileText, BarChart3, Globe2, CloudRain, Car, Wind
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { generateAIResponse } from '../services/aiApi';

import WeatherForecastCard from '../components/WeatherForecastCard';
import AQIGauge from '../components/AQIGauge';
import WeatherTrendChart from '../components/WeatherTrendChart';
import RainProbabilityGraph from '../components/RainProbabilityGraph';
import ClimateInsightPanel from '../components/ClimateInsightPanel';
import WeatherImageBanner from '../components/WeatherImageBanner';

/* ══════════════════════════════════════════════════════════
   SMART SUGGESTION GENERATOR
   Analyzes user query + live weather context to produce
   5 dynamic, contextual next-step chips per response.
══════════════════════════════════════════════════════════ */
const generateSuggestions = (userMessage, weather, airQuality) => {
  const q = userMessage.toLowerCase();
  const city = weather?.name || 'your location';
  const condition = weather?.weather?.[0]?.main?.toLowerCase() || '';
  const temp = weather ? Math.round(weather.main?.temp) : 25;
  const aqi = airQuality?.list?.[0]?.main?.aqi || 1;
  const isRain = condition.includes('rain') || condition.includes('drizzle') || condition.includes('storm');
  const isHot = temp > 32;
  const isPoorAQI = aqi >= 3;

  // ── AQI / air quality focused ──
  if (q.includes('aqi') || q.includes('air quality') || q.includes('pollution') || q.includes('smog') || q.includes('pm2.5') || q.includes('pm10')) {
    return [
      { label: 'PM2.5 & PM10 levels', emoji: '🌫️', query: `What are the current PM2.5 and PM10 particle levels in ${city}?` },
      { label: 'Safe to exercise outside?', emoji: '🏃', query: `Is it safe to exercise outdoors in ${city} with today's air quality?` },
      { label: 'Mask needed today?', emoji: '😷', query: `Do I need to wear a mask outside in ${city} today?` },
      { label: 'Best outdoor time', emoji: '⏰', query: `When is the best time to go outside in ${city} today given the air quality?` },
      { label: 'Kids outdoor safety', emoji: '🧒', query: `Is it safe for children to play outside in ${city} today?` },
    ];
  }

  // ── Rain / precipitation focused ──
  if (q.includes('rain') || q.includes('umbrella') || q.includes('drizzle') || q.includes('storm') || q.includes('precipitation') || q.includes('shower')) {
    return [
      { label: 'Need an umbrella?', emoji: '☂️', query: `Do I need an umbrella in ${city} today?` },
      { label: 'When will it rain?', emoji: '⏰', query: `At what hours will it rain in ${city} today?` },
      { label: 'Weekend forecast', emoji: '📅', query: `What is the weekend weather forecast for ${city}?` },
      { label: 'Travel impact', emoji: '🚆', query: `How will rain affect commuting and travel in ${city} today?` },
      { label: 'Flooding risk?', emoji: '🌊', query: `Is there any flooding risk in ${city} from the rain?` },
    ];
  }

  // ── Temperature focused ──
  if (q.includes('temp') || q.includes('hot') || q.includes('cold') || q.includes('heat') || q.includes('warm') || q.includes('cool') || q.includes('degree') || q.includes('°c') || q.includes('°f')) {
    return [
      { label: 'Feels like?', emoji: '🌡️', query: `What does the temperature feel like in ${city} right now?` },
      isHot
        ? { label: 'Heat safety tips', emoji: '🔥', query: `What heat safety precautions should I take in ${city} today?` }
        : { label: 'Warmest time today', emoji: '☀️', query: `When will it be warmest in ${city} today?` },
      { label: 'What to wear', emoji: '👕', query: `What should I wear in ${city} today given the temperature?` },
      { label: '7-day forecast', emoji: '📅', query: `Show me the 7-day temperature forecast for ${city}` },
      isHot
        ? { label: 'Stay hydrated', emoji: '💧', query: `How much water should I drink in ${city} today to stay safe?` }
        : { label: 'Layer up?', emoji: '🧥', query: `Should I dress in layers in ${city} today?` },
    ];
  }

  // ── UV / sun focused ──
  if (q.includes('uv') || q.includes('sunscreen') || q.includes('sunburn') || q.includes('solar') || q.includes('sun exposure')) {
    return [
      { label: 'Safe sun hours', emoji: '⏱️', query: `When are the safest hours to be in the sun in ${city}?` },
      { label: 'SPF recommendation', emoji: '🧴', query: `What SPF sunscreen do I need in ${city} today?` },
      { label: 'UV peak time', emoji: '☀️', query: `When does the UV index reach its peak in ${city} today?` },
      { label: 'Eye protection?', emoji: '🕶️', query: `Do I need sunglasses when going outside in ${city} today?` },
      { label: 'Air quality today', emoji: '🌿', query: `What is the air quality in ${city} today?` },
    ];
  }

  // ── Wind focused ──
  if (q.includes('wind') || q.includes('breeze') || q.includes('gale') || q.includes('hurricane') || q.includes('gusts')) {
    return [
      { label: 'Wind direction', emoji: '🧭', query: `Which direction is the wind blowing in ${city} today?` },
      { label: 'Safe for outdoor sports?', emoji: '🏄', query: `Is it safe to do outdoor sports in ${city} with these wind conditions?` },
      { label: 'Driving impact', emoji: '🚗', query: `How do current wind conditions affect driving in ${city}?` },
      { label: 'Hourly wind forecast', emoji: '📊', query: `Show me the hourly wind forecast for ${city} today` },
      { label: 'Effect on air quality', emoji: '🌿', query: `How does today's wind affect air quality in ${city}?` },
    ];
  }

  // ── Travel / commute focused ──
  if (q.includes('travel') || q.includes('commute') || q.includes('drive') || q.includes('trip') || q.includes('route') || q.includes('road') || q.includes('fly') || q.includes('airport')) {
    return [
      { label: 'Road conditions', emoji: '🛣️', query: `What are the driving conditions in ${city} today?` },
      { label: 'Best travel time', emoji: '⏰', query: `What is the safest time to travel in ${city} today?` },
      { label: 'Rain risk on route', emoji: '🌧️', query: `Will it rain during my commute in ${city}?` },
      { label: 'Visibility today', emoji: '👁️', query: `What is the visibility like in ${city} today?` },
      { label: 'Weekend travel?', emoji: '🚗', query: `Is this weekend good for road travel from ${city}?` },
    ];
  }

  // ── Health focused ──
  if (q.includes('health') || q.includes('sick') || q.includes('asthma') || q.includes('allergy') || q.includes('breath') || q.includes('respiratory') || q.includes('elderly')) {
    return [
      { label: 'AQI health impact', emoji: '❤️', query: `How does the current air quality in ${city} affect my health?` },
      { label: 'Safe to exercise?', emoji: '🏃', query: `Is it safe to exercise outdoors in ${city} today?` },
      { label: 'Allergen levels', emoji: '🤧', query: `Are allergen or pollen levels high in ${city} today?` },
      { label: 'Humidity comfort', emoji: '💧', query: `Is the humidity comfortable in ${city} today?` },
      { label: 'Vulnerable groups', emoji: '🧒', query: `What weather precautions should elderly and children take in ${city} today?` },
    ];
  }

  // ── General / contextual fallback ──
  const chips = [];
  if (isRain) {
    chips.push({ label: 'When will it stop?', emoji: '⏰', query: `When will it stop raining in ${city}?` });
    chips.push({ label: 'Rain travel impact', emoji: '🚆', query: `How does the rain affect travel in ${city} today?` });
  } else {
    chips.push({ label: 'Will it rain today?', emoji: '🌧️', query: `Will it rain in ${city} today?` });
    chips.push({ label: 'UV exposure today', emoji: '☀️', query: `What is the UV index in ${city} today?` });
  }

  if (isPoorAQI) {
    chips.push({ label: 'AQI health advisory', emoji: '😷', query: `Is the air quality safe to breathe in ${city} right now?` });
  } else {
    chips.push({ label: 'Air quality today', emoji: '🌿', query: `What is the current air quality in ${city}?` });
  }

  chips.push(
    isHot
      ? { label: 'Heat tips today', emoji: '🔥', query: `How to stay safe in the heat in ${city} today?` }
      : { label: 'Best outdoor time', emoji: '🌇', query: `When is the best time to be outside in ${city} today?` }
  );
  chips.push({ label: '7-day forecast', emoji: '📅', query: `Show me the 7-day weather forecast for ${city}` });

  return chips;
};

/* ══════════════════════════════════════════════════════════
   ACTION BUTTONS GENERATOR
   Premium contextual action buttons shown below AI responses
══════════════════════════════════════════════════════════ */
const getActionButtons = (weather, airQuality, topic) => {
  const city = weather?.name || 'here';
  const aqi = airQuality?.list?.[0]?.main?.aqi || 1;
  const condition = weather?.weather?.[0]?.main?.toLowerCase() || '';
  const isRain = condition.includes('rain') || condition.includes('drizzle');

  const buttons = [
    {
      id: 'report',
      icon: FileText,
      label: 'Climate Report',
      style: 'border-cyan-500/30 hover:border-cyan-400/60 text-cyan-300 hover:shadow-[0_0_14px_rgba(34,211,238,0.3)]',
      query: `Generate a complete climate report for ${city}. Include: current weather summary, air quality analysis with health impact, travel safety assessment, precipitation forecast, UV index, wind conditions, and best activity timings for today.`,
    },
    {
      id: 'visual',
      icon: BarChart3,
      label: 'Visual Analysis',
      style: 'border-purple-500/30 hover:border-purple-400/60 text-purple-300 hover:shadow-[0_0_14px_rgba(168,85,247,0.3)]',
      query: `Show me a complete visual weather analysis for ${city} with hourly temperature trends and weekly forecast.`,
    },
    {
      id: 'travel',
      icon: Car,
      label: 'Travel Safety',
      style: 'border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 hover:shadow-[0_0_14px_rgba(52,211,153,0.3)]',
      query: `Analyze travel and commute safety in ${city} today. Cover road conditions, visibility, rain risk, wind impact, and best travel windows.`,
    },
  ];

  if (isRain || topic === 'rain' || topic === 'tomorrow') {
    buttons.push({
      id: 'rain',
      icon: CloudRain,
      label: 'Rain Timeline',
      style: 'border-blue-500/30 hover:border-blue-400/60 text-blue-300 hover:shadow-[0_0_14px_rgba(96,165,250,0.3)]',
      query: `Give me a detailed hour-by-hour rain forecast for ${city} today and tomorrow.`,
    });
  }

  if (aqi >= 2 || topic === 'aqi') {
    buttons.push({
      id: 'aqi',
      icon: Wind,
      label: 'AQI Breakdown',
      style: 'border-orange-500/30 hover:border-orange-400/60 text-orange-300 hover:shadow-[0_0_14px_rgba(251,146,60,0.3)]',
      query: `Give me a full air quality breakdown for ${city}: PM2.5, PM10 levels, health impact by group, safe exposure limits, and recommended precautions.`,
    });
  }

  buttons.push({
    id: 'compare',
    icon: Globe2,
    label: 'Compare Cities',
    style: 'border-rose-500/30 hover:border-rose-400/60 text-rose-300 hover:shadow-[0_0_14px_rgba(251,113,133,0.3)]',
    query: `Compare the current weather and air quality in ${city} with a major nearby city. Highlight the key differences and which city has better conditions today.`,
  });

  return buttons;
};

/* ══════════════════════════════════════════════════════════
   LIGHTWEIGHT TOPIC DETECTOR (frontend-side)
══════════════════════════════════════════════════════════ */
const detectTopic = (msg) => {
  const q = msg.toLowerCase();
  if (q.includes('aqi') || q.includes('air quality') || q.includes('pollution') || q.includes('pm2.5')) return 'aqi';
  if (q.includes('rain') || q.includes('umbrella') || q.includes('drizzle') || q.includes('storm') || q.includes('precipitation')) return 'rain';
  if (q.includes('tomorrow') || q.includes('kal') || q.includes('next day')) return 'tomorrow';
  if (q.includes('weekly') || q.includes('week') || q.includes('7 day') || q.includes('forecast')) return 'weekly';
  if (q.includes('temp') || q.includes('hot') || q.includes('cold') || q.includes('heat')) return 'temperature';
  if (q.includes('uv') || q.includes('sunscreen') || q.includes('solar')) return 'uv';
  if (q.includes('wind') || q.includes('breeze')) return 'wind';
  if (q.includes('travel') || q.includes('commute') || q.includes('drive')) return 'travel';
  if (q.includes('health') || q.includes('asthma') || q.includes('allergy')) return 'health';
  return 'general';
};

/* ══════════════════════════════════════════════════════════
   AI CORE ORB — Ambient background visual
══════════════════════════════════════════════════════════ */
const AICoreOrb = ({ isTyping, weatherTheme }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden mix-blend-screen">
    <motion.div
      animate={{ scale: isTyping ? [1, 1.15, 1] : [1, 1.05, 1], rotate: 360 }}
      transition={{ duration: isTyping ? 3 : 20, repeat: Infinity, ease: 'linear' }}
      className={`w-[500px] h-[500px] relative opacity-30 transition-all duration-1000 ${weatherTheme.orbGlow}`}
    >
      <div className="absolute inset-0 rounded-full blur-[100px] bg-current" />
      <div className="absolute inset-10 border-2 border-white/10 rounded-full border-dashed" style={{ animation: 'spin 30s linear infinite' }} />
      <div className="absolute inset-24 border border-white/20 rounded-full" />
      <div className="absolute inset-32 border border-white/5 rounded-full border-dashed" style={{ animation: 'spin 20s linear infinite reverse' }} />
    </motion.div>
  </div>
);

/* ══════════════════════════════════════════════════════════
   SMART SUGGESTION CHIPS
   Appear inside AI messages after response completes
══════════════════════════════════════════════════════════ */
const SmartSuggestions = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-5 pt-4 border-t border-white/10"
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
        <Sparkles className="w-3 h-3 text-cyan-400" />
        Explore Next
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(s.query)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[12px] font-bold bg-slate-900/70 border border-white/15 hover:border-cyan-400/50 hover:bg-cyan-950/40 hover:shadow-[0_0_14px_rgba(34,211,238,0.15)] text-slate-200 hover:text-white transition-all duration-300 cursor-pointer backdrop-blur-sm"
          >
            <span className="text-sm leading-none">{s.emoji}</span>
            <span>{s.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   AI ACTION BUTTONS
   Premium contextual quick-action row below AI responses
══════════════════════════════════════════════════════════ */
const AIActionButtons = ({ actions, onSelect }) => {
  if (!actions || actions.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 }}
      className="mt-3"
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
        <Zap className="w-3 h-3 text-amber-400" />
        Quick Actions
      </p>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(action.query)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider bg-slate-950/60 border backdrop-blur-sm transition-all duration-300 cursor-pointer ${action.style}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {action.label}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   STREAMING MESSAGE BUBBLE
   Typewriter reveal → visual cards → suggestions → actions
══════════════════════════════════════════════════════════ */
const StreamingMessageBubble = ({ text, visualData, suggestions, actions, onComplete, onSuggest }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showExtras, setShowExtras] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
        onComplete();
        setTimeout(() => setShowExtras(true), 350);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <div className="space-y-3 w-full text-left">
      <p className="text-slate-100 leading-relaxed font-semibold text-[15px] whitespace-pre-line">
        {displayedText}
        {!isTypingComplete && <span className="inline-block w-1.5 h-4 bg-cyan-400 ml-1 animate-pulse" />}
      </p>

      <AnimatePresence>
        {showExtras && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="space-y-4"
          >
            {/* Visual data cards */}
            {visualData && (
              <div className="mt-5 space-y-5 pt-4 border-t border-white/10">
                <WeatherImageBanner condition={visualData.condition} topic={visualData.charts?.activeChart} />
                <ClimateInsightPanel insights={visualData.insights} />
                <div className="grid grid-cols-1 gap-5">
                  {visualData.charts?.activeChart === 'aqi' && <AQIGauge aqiData={visualData.AQI} />}
                  {(visualData.charts?.activeChart === 'rain' || visualData.charts?.activeChart === 'tomorrow') && (
                    <RainProbabilityGraph rainChance={visualData.rainChance} />
                  )}
                  {(visualData.charts?.activeChart === 'temperature' || visualData.charts?.activeChart === 'weekly') && (
                    <WeatherTrendChart hourlyData={visualData.hourlyTemps} />
                  )}
                  {visualData.charts?.activeChart === 'general' && (
                    <WeatherForecastCard forecastList={visualData.forecast} />
                  )}
                </div>
              </div>
            )}

            {/* Smart suggestions + action buttons */}
            <SmartSuggestions suggestions={suggestions} onSelect={onSuggest} />
            <AIActionButtons actions={actions} onSelect={onSuggest} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   STATIC MESSAGE BUBBLE — historical AI messages
══════════════════════════════════════════════════════════ */
const StaticMessageBubble = ({ text, visualData, suggestions, actions, onSuggest }) => (
  <div className="space-y-3 w-full text-left">
    <p className="text-slate-100 leading-relaxed font-semibold text-[15px] whitespace-pre-line">{text}</p>

    {visualData && (
      <div className="mt-5 space-y-5 pt-4 border-t border-white/10">
        <WeatherImageBanner condition={visualData.condition} topic={visualData.charts?.activeChart} />
        <ClimateInsightPanel insights={visualData.insights} />
        <div className="grid grid-cols-1 gap-5">
          {visualData.charts?.activeChart === 'aqi' && <AQIGauge aqiData={visualData.AQI} />}
          {(visualData.charts?.activeChart === 'rain' || visualData.charts?.activeChart === 'tomorrow') && (
            <RainProbabilityGraph rainChance={visualData.rainChance} />
          )}
          {(visualData.charts?.activeChart === 'temperature' || visualData.charts?.activeChart === 'weekly') && (
            <WeatherTrendChart hourlyData={visualData.hourlyTemps} />
          )}
          {visualData.charts?.activeChart === 'general' && (
            <WeatherForecastCard forecastList={visualData.forecast} />
          )}
        </div>
      </div>
    )}

    {/* Suggestions always visible in history */}
    <SmartSuggestions suggestions={suggestions} onSelect={onSuggest} />
    <AIActionButtons actions={actions} onSelect={onSuggest} />
  </div>
);

/* ══════════════════════════════════════════════════════════
   MAIN ASSISTANT COMPONENT
══════════════════════════════════════════════════════════ */
const Assistant = () => {
  const { weather, airQuality, forecast } = useWeather();
  const [messages, setMessages] = useState([{
    id: 1,
    type: 'ai',
    text: "Hi! I'm AtmosIQ, your personal AI weather assistant. I can help you with current conditions, air quality, forecasts, travel recommendations, and health advice. What would you like to know?",
    isStreaming: false,
    suggestions: null,
    actions: null,
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [bottomChips, setBottomChips] = useState(null); // null = show weather-context defaults
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.substring(0, 300));
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Speech recognition is not supported in this browser.'); return; }
    if (isListening) { setIsListening(false); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => { setInput(e.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (e, customInput = null) => {
    if (e) e.preventDefault();
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = { id: Date.now(), type: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const aiResult = await generateAIResponse(textToSend, weather, airQuality, forecast);
    const aiResponseText = aiResult.response || "I'm having trouble responding right now. Please try again.";
    const visualData = aiResult.visualData || null;

    // Generate contextual suggestions + action buttons
    const topic = detectTopic(textToSend);
    const suggestions = generateSuggestions(textToSend, weather, airQuality);
    const actions = getActionButtons(weather, airQuality, topic);

    // Update the bottom bar to show first 4 chips from this response
    setBottomChips(suggestions.slice(0, 4));

    const aiResponse = {
      id: Date.now() + 1,
      type: 'ai',
      text: aiResponseText,
      visualData,
      isStreaming: true,
      suggestions,
      actions,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);
    speak(aiResponseText);
  };

  const markStreamingComplete = (msgId) => {
    setMessages((prev) => prev.map((msg) => msg.id === msgId ? { ...msg, isStreaming: false } : msg));
  };

  const getWeatherTheme = () => {
    if (!weather) return { bg: 'from-slate-900 via-indigo-950 to-slate-900', orbGlow: 'text-cyan-500', textGlow: 'text-glow-cyan' };
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('rain') || main.includes('drizzle')) return { bg: 'from-slate-900 via-blue-900/40 to-slate-900', orbGlow: 'text-blue-500', textGlow: 'text-glow-cyan' };
    if (main.includes('clear')) return { bg: 'from-slate-900 via-orange-900/30 to-slate-900', orbGlow: 'text-orange-500', textGlow: 'text-glow-cyan' };
    if (main.includes('thunderstorm')) return { bg: 'from-slate-950 via-purple-900/40 to-slate-950', orbGlow: 'text-purple-500', textGlow: 'text-glow-cyan' };
    return { bg: 'from-slate-900 via-indigo-950/40 to-slate-900', orbGlow: 'text-cyan-500', textGlow: 'text-glow-cyan' };
  };

  const theme = getWeatherTheme();

  // Default chips shown before any conversation (context-aware)
  const defaultChips = weather
    ? generateSuggestions('weather today', weather, airQuality).slice(0, 4)
    : [
        { label: 'Current weather', emoji: '🌤️', query: 'What is the current weather?' },
        { label: 'Air quality today', emoji: '🌿', query: 'What is the air quality today?' },
        { label: 'Will it rain?', emoji: '🌧️', query: 'Will it rain today?' },
        { label: '7-day forecast', emoji: '📅', query: 'Show me the weekly forecast' },
      ];

  const visibleBottomChips = bottomChips ?? defaultChips;

  return (
    <div className={`relative min-h-screen w-full transition-colors duration-1000 bg-gradient-to-br ${theme.bg} overflow-x-hidden`}>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-chat-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-chat-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 999px; }
        .custom-chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 999px; }
        .custom-chat-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.5); }
      ` }} />

      <AICoreOrb isTyping={isTyping} weatherTheme={theme} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay" />

      <div className="relative max-w-[1400px] w-[92%] mx-auto pt-32 pb-16 z-10">

        {/* ── Header ── */}
        <div className="text-center w-full mb-8 relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 mb-4 backdrop-blur-md shadow-lg shadow-black/20">
            <Bot className="w-3 h-3" />
            AI Assistant
          </div>
          <h1 className="text-4xl md:text-5xl font-black flex items-center justify-center gap-4 mb-3 tracking-tight">
            <CloudSun className={`w-10 h-10 md:w-12 md:h-12 ${theme.textGlow}`} />
            <span className={`bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 drop-shadow-2xl ${theme.textGlow}`}>
              AtmosIQ AI
            </span>
          </h1>
          <p className="text-white/60 font-medium tracking-wide flex items-center justify-center gap-2 text-xs md:text-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
            Live weather data · AI-powered insights
          </p>
        </div>

        {/* ── Chat Console ── */}
        <div className="w-full h-[700px] max-h-[700px] min-h-[700px] flex flex-col overflow-hidden relative glass-dark rounded-[2.5rem] border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)] backdrop-blur-3xl z-10">

          {/* Messages viewport */}
          <div
            className="flex-1 overflow-y-auto custom-chat-scrollbar p-6 md:p-8 space-y-6 scroll-smooth relative"
            style={{ overscrollBehavior: 'contain' }}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} relative z-10`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-purple-400/30'
                      : 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  }`}>
                    {msg.type === 'user'
                      ? <User className="w-5 h-5 text-white" />
                      : <img src="/logo.png" alt="AtmosIQ" className="w-6 h-6 object-contain p-0.5 scale-125" />}
                  </div>

                  {/* Message bubble */}
                  <div className={`max-w-[85%] md:max-w-[78%] rounded-2xl px-5 py-4 shadow-2xl backdrop-blur-md relative group ${
                    msg.type === 'user'
                      ? 'bg-indigo-950/85 rounded-tr-none border border-indigo-400/40 text-left'
                      : 'bg-slate-950/85 rounded-tl-none border border-cyan-500/35 text-left'
                  }`}>
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl ${
                      msg.type === 'user' ? 'bg-purple-500/10' : 'bg-cyan-500/10'
                    }`} />

                    {msg.type === 'user' ? (
                      <p className="text-slate-100 leading-relaxed font-semibold text-[15px] whitespace-pre-line">{msg.text}</p>
                    ) : msg.isStreaming ? (
                      <StreamingMessageBubble
                        text={msg.text}
                        visualData={msg.visualData}
                        suggestions={msg.suggestions}
                        actions={msg.actions}
                        onComplete={() => markStreamingComplete(msg.id)}
                        onSuggest={(q) => handleSend(null, q)}
                      />
                    ) : (
                      <StaticMessageBubble
                        text={msg.text}
                        visualData={msg.visualData}
                        suggestions={msg.suggestions}
                        actions={msg.actions}
                        onSuggest={(q) => handleSend(null, q)}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Thinking indicator */}
            {isTyping && (
              <div className="flex gap-4 flex-row">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                  <Bot className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="bg-slate-950/85 rounded-2xl rounded-tl-none px-5 py-3.5 border border-cyan-500/30 flex items-center gap-3 backdrop-blur-md">
                  <span className="text-cyan-400 text-xs font-extrabold uppercase tracking-widest animate-pulse">Thinking...</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* ── Dynamic Bottom Context Bar ──
              Before conversation: weather-context defaults.
              After responses: top 4 chips from last AI reply.
          */}
          <AnimatePresence>
            {visibleBottomChips.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 py-3.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-white/10 bg-slate-950/60 backdrop-blur-xl shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400/60 shrink-0" />
                {visibleBottomChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(null, chip.query)}
                    className="whitespace-nowrap text-[12px] font-bold bg-slate-900/80 border border-white/15 hover:border-cyan-400/60 rounded-2xl px-3.5 py-2 transition-all duration-300 flex items-center gap-1.5 text-slate-300 hover:text-white hover:bg-cyan-950/40 hover:shadow-[0_0_12px_rgba(34,211,238,0.2)] hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span className="text-sm leading-none">{chip.emoji}</span>
                    {chip.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Input Bar ── */}
          <div className="p-5 md:p-6 bg-slate-950/70 border-t border-white/10 backdrop-blur-2xl shrink-0">
            <form onSubmit={(e) => handleSend(e)} className="relative flex items-center gap-3">

              <button
                type="button"
                onClick={toggleListen}
                className={`p-3.5 rounded-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-red-500/20 border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] text-red-400'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                {isListening && (
                  <div className="absolute inset-0 flex items-center justify-center gap-0.5 opacity-50">
                    {[1, 2, 3].map(i => (
                      <motion.div
                        key={i}
                        animate={{ height: ['20%', '80%', '20%'] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-0.5 bg-red-400 rounded-full"
                      />
                    ))}
                  </div>
                )}
                {isListening ? <MicOff className="w-5 h-5 relative z-10" /> : <Mic className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />}
              </button>

              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about weather, AQI, forecasts..."
                  className="w-full bg-slate-900 border border-white/25 rounded-xl py-3.5 pl-5 pr-12 text-sm text-white font-semibold focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-slate-400 shadow-inner relative z-10"
                />
                <Zap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-500 transition-colors z-20" />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-3.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden shrink-0 cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <Send className="w-5 h-5 relative z-10" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Assistant;
