import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mic, MicOff, Zap, CloudSun, Send, Bot, Sparkles } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { generateAIResponse } from '../services/aiApi';

/* ══════════════════════════════════════════════════════════
   US AQI ESTIMATOR FROM PM2.5 (OWM Compatibility)
   Standard EPA conversion logic
   ══════════════════════════════════════════════════════════ */
const getUsAQIFromPm25 = (pm25) => {
  if (pm25 === undefined || pm25 === null) return 50;
  if (pm25 <= 12.0) {
    return Math.round((50 / 12) * pm25);
  } else if (pm25 <= 35.4) {
    return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
  } else if (pm25 <= 55.4) {
    return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
  } else if (pm25 <= 150.4) {
    return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
  } else if (pm25 <= 250.4) {
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
  } else {
    return Math.round(((500 - 301) / (500.0 - 250.5)) * (pm25 - 250.5) + 301);
  }
};

/* ══════════════════════════════════════════════════════════
   SMART DYNAMIC SUGGESTION GENERATOR
   Scored dynamically based on weather indices and query terms
   ══════════════════════════════════════════════════════════ */
const generateSuggestions = (userMessage, weather, airQuality) => {
  const q = userMessage.toLowerCase();
  const city = weather?.name || 'your city';
  const condition = weather?.weather?.[0]?.main?.toLowerCase() || '';
  const temp = weather ? Math.round(weather.main?.temp) : 25;
  const pm2_5 = airQuality?.list?.[0]?.components?.pm2_5;
  const aqiVal = airQuality?.list?.[0]?.main?.aqi || 1;
  const usAqi = pm2_5 !== undefined ? getUsAQIFromPm25(pm2_5) : (aqiVal * 40);

  const isRain = condition.includes('rain') || condition.includes('drizzle') || condition.includes('storm');
  const isHot = temp > 32;
  const isPoorAQI = usAqi > 100;
  const isWindy = weather?.wind?.speed > 8;

  const candidates = [
    {
      id: 'umbrella',
      label: 'Umbrella needed?',
      emoji: '☔',
      query: `Do I need to carry an umbrella in ${city} today?`,
      score: isRain ? 10 : (q.includes('rain') || q.includes('umbrella') ? 8 : 2)
    },
    {
      id: 'aqi',
      label: 'AQI safe?',
      emoji: '😷',
      query: `Is the current air quality and AQI safe in ${city}?`,
      score: isPoorAQI ? 10 : (q.includes('aqi') || q.includes('air') || q.includes('pollution') ? 8 : 4)
    },
    {
      id: 'heat',
      label: 'Heat tomorrow?',
      emoji: '🌡️',
      query: `Will there be extreme heat or high temperature tomorrow in ${city}?`,
      score: isHot ? 9 : (q.includes('temp') || q.includes('hot') || q.includes('heat') ? 8 : 3)
    },
    {
      id: 'travel',
      label: 'Travel conditions?',
      emoji: '🚗',
      query: `What are the driving and travel conditions like in ${city} today?`,
      score: q.includes('travel') || q.includes('commute') || q.includes('road') ? 9 : (isRain || isWindy ? 7 : 3)
    },
    {
      id: 'weekend',
      label: 'Weekend rain?',
      emoji: '🌧️',
      query: `Is there any rain expected this weekend in ${city}?`,
      score: q.includes('weekend') || q.includes('week') ? 9 : (isRain ? 6 : 2)
    },
    {
      id: 'exercise',
      label: 'Safe for exercise?',
      emoji: '🏃',
      query: `Is today's weather safe for outdoor exercise or workouts in ${city}?`,
      score: isPoorAQI || isHot || isRain ? 9 : (q.includes('exercise') || q.includes('workout') ? 8 : 3)
    },
    {
      id: 'outdoor',
      label: 'Best outdoor time?',
      emoji: '🌅',
      query: `When is the best and safest time to go outdoors in ${city} today?`,
      score: q.includes('outside') || q.includes('outdoor') || q.includes('time') ? 9 : (isHot || isPoorAQI ? 8 : 4)
    },
    {
      id: 'wind',
      label: 'Wind conditions?',
      emoji: '💨',
      query: `What are the wind and breeze conditions in ${city} today?`,
      score: isWindy ? 9 : (q.includes('wind') || q.includes('speed') ? 8 : 2)
    }
  ];

  const sorted = [...candidates].sort((a, b) => b.score - a.score);
  return sorted.slice(0, 5);
};

/* ══════════════════════════════════════════════════════════
   COMPACT GLOWING METRICS PILL ROW
   ══════════════════════════════════════════════════════════ */
const CompactMetricsRow = ({ visualData, currentWeather, currentAQI }) => {
  let tempVal = visualData?.temp ?? (currentWeather?.main?.temp !== undefined ? Math.round(currentWeather.main.temp) : null);

  let aqiVal = visualData?.AQI?.usAqi ?? null;
  if (aqiVal === null && currentAQI) {
    const pm2_5 = currentAQI?.list?.[0]?.components?.pm2_5;
    const rawAqi = currentAQI?.list?.[0]?.main?.aqi;
    if (pm2_5 !== undefined) {
      aqiVal = getUsAQIFromPm25(pm2_5);
    } else if (rawAqi !== undefined) {
      const mappings = { 1: 35, 2: 72, 3: 115, 4: 158, 5: 220 };
      aqiVal = mappings[rawAqi];
    }
  }

  let humidityVal = visualData?.humidity ?? (currentWeather?.main?.humidity !== undefined ? currentWeather.main.humidity : null);
  let windVal = visualData?.windSpeed ?? (currentWeather?.wind?.speed !== undefined ? currentWeather.wind.speed : null);

  if (tempVal === null && aqiVal === null && humidityVal === null && windVal === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 mt-4"
    >
      {tempVal !== null && (
        <span className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono tracking-wide bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)] backdrop-blur-sm">
          🌡️ {tempVal}°C
        </span>
      )}
      {aqiVal !== null && (
        <span className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono tracking-wide bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-sm">
          😷 AQI {aqiVal}
        </span>
      )}
      {humidityVal !== null && (
        <span className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono tracking-wide bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-sm">
          💧 Humidity {humidityVal}%
        </span>
      )}
      {windVal !== null && (
        <span className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono tracking-wide bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)] backdrop-blur-sm">
          💨 Wind {Math.round(windVal)} m/s
        </span>
      )}
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════
   SMART RECOMMENDATION CHIPS
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
   STREAMING MESSAGE BUBBLE
   ══════════════════════════════════════════════════════════ */
const StreamingMessageBubble = ({ text, visualData, suggestions, onComplete, onSuggest, currentWeather, currentAQI }) => {
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
            <CompactMetricsRow visualData={visualData} currentWeather={currentWeather} currentAQI={currentAQI} />
            <SmartSuggestions suggestions={suggestions} onSelect={onSuggest} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   STATIC MESSAGE BUBBLE
   ══════════════════════════════════════════════════════════ */
const StaticMessageBubble = ({ text, visualData, suggestions, onSuggest, currentWeather, currentAQI }) => (
  <div className="space-y-3 w-full text-left">
    <p className="text-slate-100 leading-relaxed font-semibold text-[15px] whitespace-pre-line">{text}</p>
    <CompactMetricsRow visualData={visualData} currentWeather={currentWeather} currentAQI={currentAQI} />
    <SmartSuggestions suggestions={suggestions} onSelect={onSuggest} />
  </div>
);

/* ══════════════════════════════════════════════════════════
   AI CORE ORB
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
   MAIN CONVERSATIONAL ASSISTANT PAGE
   ══════════════════════════════════════════════════════════ */
const Assistant = () => {
  const { weather, airQuality, forecast } = useWeather();
  const [messages, setMessages] = useState([{
    id: 1,
    type: 'ai',
    text: "Hi! I'm AtmosIQ, your personal AI weather assistant. Ask me anything about real-time weather conditions, forecasts, air quality indices, or travel impact. I support Hinglish, English, and Hindi natively!",
    isStreaming: false,
    suggestions: null,
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [bottomChips, setBottomChips] = useState(null);
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
    const aiResponseText = aiResult.reply ||
      `AtmosIQ AI abhi thoda overloaded hai 🤖  
Lekin live weather data active hai. ${weather?.name || 'Your area'} me abhi ${weather?.weather?.[0]?.description || 'stable conditions'} hain with temperature around ${Math.round(weather?.main?.temp || 0)}°C.`;
    const visualData = aiResult.visualData || null;

    const suggestions = generateSuggestions(textToSend, weather, airQuality);
    setBottomChips(suggestions.slice(0, 4));

    const aiResponse = {
      id: Date.now() + 1,
      type: 'ai',
      text: aiResponseText,
      visualData,
      isStreaming: true,
      suggestions,
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
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-chat-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-chat-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 999px; }
        .custom-chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.2); border-radius: 999px; }
        .custom-chat-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.5); }
      ` }} />

      <AICoreOrb isTyping={isTyping} weatherTheme={theme} />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay" />

      <div className="relative max-w-[1400px] w-[92%] mx-auto pt-32 pb-16 z-10">

        {/* Header */}
        <div className="text-center w-full mb-8 relative z-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 mb-4 backdrop-blur-md shadow-lg shadow-black/20 animate-pulse">
            <Bot className="w-3 h-3" />
            AtmosIQ Intelligent Assistant
          </div>
          <h1 className="text-4xl md:text-5xl font-black flex items-center justify-center gap-4 mb-3 tracking-tight">
            <CloudSun className={`w-10 h-10 md:w-12 md:h-12 ${theme.textGlow}`} />
            <span className={`bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 drop-shadow-2xl ${theme.textGlow}`}>
              AtmosIQ AI
            </span>
          </h1>
          <p className="text-white/60 font-medium tracking-wide flex items-center justify-center gap-2 text-xs md:text-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
            Pure Conversational Climate Intelligence
          </p>
        </div>

        {/* Chat Console */}
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
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg border ${msg.type === 'user'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-purple-400/30'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    }`}>
                    {msg.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white animate-pulse" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className={`max-w-[85%] md:max-w-[78%] rounded-2xl px-5 py-4 shadow-2xl backdrop-blur-md relative group ${msg.type === 'user'
                    ? 'bg-indigo-950/85 rounded-tr-none border border-indigo-400/40 text-left'
                    : 'bg-slate-950/85 rounded-tl-none border border-cyan-500/35 text-left'
                    }`}>
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl ${msg.type === 'user' ? 'bg-purple-500/10' : 'bg-cyan-500/10'
                      }`} />

                    {msg.type === 'user' ? (
                      <p className="text-slate-100 leading-relaxed font-semibold text-[15px] whitespace-pre-line">{msg.text}</p>
                    ) : msg.isStreaming ? (
                      <StreamingMessageBubble
                        text={msg.text}
                        visualData={msg.visualData}
                        suggestions={msg.suggestions}
                        onComplete={() => markStreamingComplete(msg.id)}
                        onSuggest={(q) => handleSend(null, q)}
                        currentWeather={weather}
                        currentAQI={airQuality}
                      />
                    ) : (
                      <StaticMessageBubble
                        text={msg.text}
                        visualData={msg.visualData}
                        suggestions={msg.suggestions}
                        onSuggest={(q) => handleSend(null, q)}
                        currentWeather={weather}
                        currentAQI={airQuality}
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

          {/* Dynamic Bottom Context Bar */}
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

          {/* Input Bar */}
          <div className="p-5 md:p-6 bg-slate-950/70 border-t border-white/10 backdrop-blur-2xl shrink-0">
            <form onSubmit={(e) => handleSend(e)} className="relative flex items-center gap-3">
              <button
                type="button"
                onClick={toggleListen}
                className={`p-3.5 rounded-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group shrink-0 cursor-pointer ${isListening
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
