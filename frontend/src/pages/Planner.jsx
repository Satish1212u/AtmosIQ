import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Sunrise, Activity, Coffee, BrainCircuit, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { generateAIResponse } from '../services/aiApi';

const Planner = () => {
  const { weather, airQuality } = useWeather();
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBriefing = async () => {
      if (!weather) return;
      setLoading(true);
      
      const prompt = `Act as AtmosIQ Core Planner. Create a personalized daily plan based on this weather and environmental data: ${Math.round(weather.main?.temp)}°C, ${weather.weather?.[0]?.description} in ${weather.name}. 
      Return ONLY a JSON object with this exact structure:
      {
        "greeting": "A personalized morning greeting",
        "summary": "Short 2 sentence weather summary",
        "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
        "schedule": [
          { "time": "Morning (6AM - 10AM)", "activity": "Best for outdoor run", "icon": "activity" },
          { "time": "Afternoon (12PM - 4PM)", "activity": "Stay hydrated, work indoors", "icon": "coffee" },
          { "time": "Evening (6PM - 9PM)", "activity": "Good for a walk", "icon": "sunset" }
        ]
      }`;
      try {
        const aiResult = await generateAIResponse(prompt, weather, airQuality);
        const aiText = aiResult.reply || aiResult.response || "";
        let jsonStr = aiText.replace(/```json\n?|\n?```/g, '').trim();
        const match = jsonStr.match(/\{[\s\S]*\}/);
        if (match) {
          jsonStr = match[0];
        }
        const result = JSON.parse(jsonStr);
        setBriefing(result);
      } catch (err) {
        console.error("Failed to parse planner AI response", err);
        setBriefing({
          greeting: `Good Day in ${weather.name}`,
          summary: `Current temperature is ${Math.round(weather.main?.temp)}°C with ${weather.weather?.[0]?.description}. Atmospheric metrics remain favorable.`,
          suggestions: [
            "Maintain proper hydration throughout midday peak",
            "Optimal daylight window for outdoor pursuits prior to 11:00 AM",
            "Evening temperatures favorable for open-air dining"
          ],
          schedule: [
            { time: "Morning (7:00 - 10:30 AM)", activity: "Optimal Atmospheric Window · Outdoor Exertion & Commute", icon: "activity" },
            { time: "Midday (12:00 - 4:00 PM)", activity: "Thermal Radiance Peak · Climate-Controlled Architecture", icon: "coffee" },
            { time: "Dusk (6:00 - 9:30 PM)", activity: "Atmospheric Calming · Leisure Promenade & Dining", icon: "sunset" }
          ]
        });
      }
      setLoading(false);
    };

    fetchBriefing();
  }, [weather]);

  if (!weather) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
      
      {/* Header */}
      <div className="mb-10 flex items-center justify-between pb-6 border-b border-[#C5A880]/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF5ED] border border-[#C5A880]/40 flex items-center justify-center text-[#B89758] shadow-sm">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-roman tracking-[0.25em] text-[#8C6D3F] uppercase block mb-0.5">
              TEMPORAL CHRONOMETER
            </span>
            <h1 className="text-3xl md:text-4xl font-editorial font-bold text-[#1C1917] tracking-tight">
              Spatial Itinerary Planner
            </h1>
            <p className="text-xs text-[#57493A] font-medium mt-0.5">
              Daylight schedule dynamically calibrated against real-time climate vectors in {weather.name}.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 border border-[#C5A880]/30 shadow-xs">
          <Clock className="w-3.5 h-3.5 text-[#B89758]" />
          <span className="text-[10px] font-roman tracking-wider uppercase text-[#6B5E51]">
            DIURNAL CALIBRATION ACTIVE
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin mb-4" />
          <p className="text-xs font-roman tracking-[0.2em] uppercase text-[#786E65]">
            CALIBRATING METEOROLOGICAL SCHEDULE...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Executive Morning Briefing Plaque */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="luxury-panel rounded-3xl p-7 shadow-md relative overflow-hidden">
              <Sunrise className="absolute -right-6 -top-6 w-28 h-28 text-[#C5A880]/10 pointer-events-none" />
              
              <span className="text-[9px] font-roman tracking-[0.2em] uppercase text-[#8C6D3F] block mb-1 font-bold">
                EXECUTIVE BRIEFING
              </span>
              <h2 className="text-2xl font-editorial font-bold mb-2 text-[#1C1917]">
                {briefing?.greeting}
              </h2>
              <p className="text-xs text-[#57493A] font-medium mb-6 leading-relaxed">
                {briefing?.summary}
              </p>
              
              <div className="pt-4 border-t border-[#C5A880]/20">
                <span className="text-[10px] font-roman tracking-widest text-[#786E65] uppercase block mb-3 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B89758]" />
                  TAILORED DIRECTIVES
                </span>
                <ul className="space-y-3">
                  {briefing?.suggestions?.map((sug, idx) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (idx * 0.1) }}
                      key={idx} 
                      className="flex items-start gap-2.5 bg-white/80 p-3 rounded-xl border border-[#C5A880]/25 shadow-xs text-xs text-[#443E38] font-medium leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#8C6D3F] shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 3D Spatial Diurnal Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 luxury-panel rounded-3xl p-7 md:p-9 shadow-md"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#C5A880]/20">
              <h2 className="text-xl font-editorial font-bold text-[#1C1917] flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-[#B89758]" />
                Diurnal Climate Trajectory & Schedule
              </h2>
              <span className="text-[10px] font-roman text-[#786E65] tracking-widest uppercase">
                TEMPORAL NODES
              </span>
            </div>

            <div className="relative">
              {/* Vertical Brushed Gold Rail */}
              <div className="absolute left-7 top-4 bottom-4 w-px bg-[#C5A880]/35"></div>
              
              <div className="space-y-6">
                {briefing?.schedule?.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    key={idx} 
                    className="relative flex items-center gap-6 z-10"
                  >
                    {/* Node Complication Seal */}
                    <div className="w-14 h-14 rounded-2xl bg-white border border-[#C5A880]/40 flex items-center justify-center shrink-0 shadow-sm text-[#8C6D3F]">
                      {idx === 0 ? <Sunrise className="w-6 h-6 text-[#C68A4C]" /> : 
                       idx === 1 ? <Coffee className="w-6 h-6 text-[#8C6D3F]" /> : 
                       <Activity className="w-6 h-6 text-[#4E7D63]" />}
                    </div>

                    {/* Event Plaque */}
                    <div className="luxury-card-3d flex-1 rounded-2xl p-5 shadow-xs">
                      <span className="text-[10px] font-roman tracking-wider uppercase text-[#8C6D3F] block mb-1 font-bold">
                        {item.time}
                      </span>
                      <div className="text-base font-editorial font-bold text-[#1C1917]">
                        {item.activity}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
};

export default Planner;
