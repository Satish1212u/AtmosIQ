import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mic, MicOff, Zap, CloudSun, Send, Bot, Sparkles } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { generateAIResponse } from '../services/aiApi';
import LuxuryAICore3D from '../components/3d/LuxuryAICore3D';

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
   COMPACT REAL-TIME METRICS ROW
   Luxury tactile pill badges
   ══════════════════════════════════════════════════════════ */
const CompactMetricsRow = ({ visualData, currentWeather, currentAQI }) => {
  const tempVal = visualData?.temp ?? (currentWeather ? Math.round(currentWeather.main?.temp) : null);
  const aqiVal = visualData?.aqi ?? currentAQI?.list?.[0]?.main?.aqi ?? null;
  const humidityVal = visualData?.humidity ?? currentWeather?.main?.humidity ?? null;
  const windVal = visualData?.wind ?? currentWeather?.wind?.speed ?? null;

  if (tempVal === null && aqiVal === null && humidityVal === null && windVal === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap gap-2 pt-2"
    >
      {tempVal !== null && (
        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-roman tracking-wider bg-white/90 border border-[#C5A880]/30 text-[#8C6D3F] shadow-sm">
          🌡️ {tempVal}°C
        </span>
      )}
      {aqiVal !== null && (
        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-roman tracking-wider bg-white/90 border border-[#C5A880]/30 text-[#4E7D63] shadow-sm">
          🌿 AQI {aqiVal}
        </span>
      )}
      {humidityVal !== null && (
        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-roman tracking-wider bg-white/90 border border-[#C5A880]/30 text-[#57493A] shadow-sm">
          💧 Humidity {humidityVal}%
        </span>
      )}
      {windVal !== null && (
        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold font-roman tracking-wider bg-white/90 border border-[#C5A880]/30 text-[#57493A] shadow-sm">
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
      className="mt-4 pt-3 border-t border-[#C5A880]/20"
    >
      <p className="text-[10px] font-roman tracking-[0.2em] uppercase text-[#786E65] mb-2.5 flex items-center gap-1.5 font-bold">
        <Sparkles className="w-3 h-3 text-[#B89758]" />
        EXPLORE NEXT
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(s.query)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 border border-[#C5A880]/35 hover:border-[#B89758] hover:bg-white text-[#57493A] hover:text-[#1C1917] transition-all shadow-sm cursor-pointer"
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
        setTimeout(() => setShowExtras(true), 300);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <div className="space-y-3 w-full text-left">
      <p className="text-[#2C2621] leading-relaxed font-medium text-[15px] whitespace-pre-line">
        {displayedText}
        {!isTypingComplete && <span className="inline-block w-1.5 h-4 bg-[#B89758] ml-1 animate-pulse" />}
      </p>

      <AnimatePresence>
        {showExtras && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-3"
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
    <p className="text-[#2C2621] leading-relaxed font-medium text-[15px] whitespace-pre-line">{text}</p>
    <CompactMetricsRow visualData={visualData} currentWeather={currentWeather} currentAQI={currentAQI} />
    <SmartSuggestions suggestions={suggestions} onSelect={onSuggest} />
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
    console.log("FINAL AI RESULT:", aiResult);
    console.log("FINAL AI TEXT:", aiResponseText);
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
    if (!weather) return { bg: 'from-[#FAF8F5] via-[#F5EFEB] to-[#FAF8F5]', orbGlow: 'text-[#C5A880]', textGlow: 'text-[#8C6D3B]' };
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('rain') || main.includes('drizzle')) return { bg: 'from-[#FAF8F5] via-[#E8EDF2] to-[#FAF8F5]', orbGlow: 'text-[#5B7B88]', textGlow: 'text-[#5B7B88]' };
    if (main.includes('clear')) return { bg: 'from-[#FAF8F5] via-[#FDF8EC] to-[#FAF8F5]', orbGlow: 'text-[#C5A880]', textGlow: 'text-[#8C6D3B]' };
    if (main.includes('thunderstorm')) return { bg: 'from-[#FAF8F5] via-[#F0EBF5] to-[#FAF8F5]', orbGlow: 'text-[#7D4D73]', textGlow: 'text-[#7D4D73]' };
    return { bg: 'from-[#FAF8F5] via-[#F5EFEB] to-[#FAF8F5]', orbGlow: 'text-[#C5A880]', textGlow: 'text-[#8C6D3B]' };
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
    <div className="relative min-h-screen w-full overflow-x-hidden pt-6 pb-16">
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-chat-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-chat-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); border-radius: 999px; }
        .custom-chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(197, 168, 128, 0.35); border-radius: 999px; }
        .custom-chat-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(184, 151, 88, 0.6); }
      ` }} />

      <div className="relative max-w-5xl w-[92%] mx-auto z-10 flex flex-col items-center">

        {/* 3D Luxury Orbital AI Core Header */}
        <div className="text-center w-full mb-6 flex flex-col items-center">
          <div className="w-52 h-52 relative flex items-center justify-center -mb-6">
            <LuxuryAICore3D isTyping={isTyping} isListening={isListening} className="w-full h-full" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/85 border border-[#C5A880]/30 text-[10px] font-roman tracking-[0.25em] uppercase text-[#8C6D3F] mb-2 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3 h-3 text-[#B89758]" />
            AtmosIQ Conversational Core · 3D Orbital
          </div>

          <h1 className="text-3xl md:text-4xl font-editorial font-bold text-[#1C1917] tracking-tight">
            Spatial Intelligence Atelier
          </h1>
          <p className="text-xs text-[#786E65] font-medium tracking-wide mt-1">
            Multilingual Atmospheric Dialogue · English, Hinglish & Hindi
          </p>
        </div>

        {/* Tactile Chat Console */}
        <div className="w-full h-[620px] max-h-[620px] flex flex-col overflow-hidden relative luxury-panel rounded-[2.5rem] border border-[#C5A880]/35 shadow-xl backdrop-blur-2xl z-10">

          {/* Messages Viewport */}
          <div
            className="flex-1 overflow-y-auto custom-chat-scrollbar p-6 md:p-8 space-y-5 scroll-smooth relative"
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
                  className={`flex gap-3.5 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} relative z-10`}
                >
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${msg.type === 'user'
                    ? 'bg-[#EAE2D3] border-[#C5A880]/40 text-[#443E38]'
                    : 'bg-[#FAF5ED] border-[#C5A880]/50 text-[#8C6D3F]'
                    }`}>
                    {msg.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[85%] md:max-w-[78%] rounded-2xl px-5 py-4 shadow-sm relative text-left ${msg.type === 'user'
                    ? 'bg-white rounded-tr-none border border-[#C5A880]/40 text-[#1C1917]'
                    : 'bg-[#FAF8F5]/95 rounded-tl-none border border-[#C5A880]/25 text-[#2C2621]'
                    }`}>
                    {msg.type === 'user' ? (
                      <p className="text-[#1C1917] leading-relaxed font-medium text-[15px] whitespace-pre-line">{msg.text}</p>
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

            {/* Thinking Indicator */}
            {isTyping && (
              <div className="flex gap-3.5 flex-row">
                <div className="w-9 h-9 rounded-xl bg-[#FAF5ED] border border-[#C5A880]/40 flex items-center justify-center shrink-0 shadow-sm text-[#8C6D3F]">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-[#FAF8F5] rounded-2xl rounded-tl-none px-4 py-3 border border-[#C5A880]/30 flex items-center gap-2.5 shadow-sm">
                  <span className="text-[#8C6D3F] text-[10px] font-roman tracking-wider uppercase">Synthesizing...</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#B89758] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#B89758] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#B89758] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                className="px-6 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-[#C5A880]/20 bg-[#FAF8F5]/80 backdrop-blur-md shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B89758] shrink-0" />
                {visibleBottomChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(null, chip.query)}
                    className="whitespace-nowrap text-xs font-medium bg-white/80 border border-[#C5A880]/30 hover:border-[#B89758] rounded-full px-3 py-1 transition-all flex items-center gap-1.5 text-[#57493A] hover:text-[#1C1917] hover:bg-white shadow-xs cursor-pointer"
                  >
                    <span className="text-xs leading-none">{chip.emoji}</span>
                    {chip.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Bar */}
          <div className="p-4 md:p-5 bg-white/85 border-t border-[#C5A880]/25 backdrop-blur-xl shrink-0">
            <form onSubmit={(e) => handleSend(e)} className="relative flex items-center gap-3">
              <button
                type="button"
                onClick={toggleListen}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center relative shrink-0 cursor-pointer ${isListening
                  ? 'bg-[#FAF0E6] border border-[#B35446] text-[#B35446] shadow-sm'
                  : 'bg-[#FAF8F5] border border-[#C5A880]/30 hover:border-[#B89758] text-[#57493A]'
                  }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Inquire about atmospheric forecasts, AQI, voyage feasibility..."
                  className="w-full bg-[#FAF8F5] border border-[#C5A880]/30 rounded-xl py-3 pl-4 pr-10 text-xs md:text-sm text-[#1C1917] font-medium focus:outline-none focus:border-[#B89758] focus:ring-1 focus:ring-[#B89758]/30 transition-all placeholder-[#A89D8F] shadow-inner"
                />
                <Zap className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89D8F]" />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="luxury-gold-btn p-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-sm shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Assistant;
