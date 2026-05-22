import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Sunrise, Activity, Coffee, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { generateAIResponse } from '../services/aiApi';

const Planner = () => {
  const { weather, forecast, airQuality } = useWeather();
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
        const aiText = aiResult.response || "";
        const cleanedText = aiText.replace(/```json\n?|\n?```/g, '').trim();
        const result = JSON.parse(cleanedText);
        setBriefing(result);
      } catch (err) {
        console.error("Failed to parse planner AI response", err);
        // Fallback
        setBriefing({
          greeting: `Good Day in ${weather.name}!`,
          summary: `It's currently ${Math.round(weather.main?.temp)}°C with ${weather.weather?.[0]?.description}.`,
          suggestions: ["Carry an umbrella just in case", "Stay hydrated", "Plan outdoor activities carefully"],
          schedule: [
            { time: "Morning", activity: "Great for a run", icon: "activity" },
            { time: "Afternoon", activity: "Stay indoors", icon: "coffee" },
            { time: "Evening", activity: "Perfect for a walk", icon: "sunset" }
          ]
        });
      }
      setLoading(false);
    };

    fetchBriefing();
  }, [weather]);

  if (!weather) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8 flex items-center gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/30">
          <CalendarDays className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-black mb-1 tracking-tight">AtmosIQ Core Planner</h1>
          <p className="text-white/70">Your day, dynamically optimized with climate telemetry.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <BrainCircuit className="w-16 h-16 text-cyan-400 animate-pulse mb-4" />
          <p className="text-white/60 animate-pulse">Generating your personalized lifestyle plan...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Smart Morning Briefing */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass rounded-3xl p-8 border-cyan-500/30 bg-gradient-to-b from-cyan-900/20 to-transparent relative overflow-hidden">
              <Sunrise className="absolute -right-6 -top-6 w-32 h-32 text-cyan-400/10" />
              <h2 className="text-2xl font-bold mb-2 text-cyan-300">{briefing?.greeting}</h2>
              <p className="text-white/80 mb-6 text-lg leading-relaxed">{briefing?.summary}</p>
              
              <h3 className="font-semibold mb-4 text-sm text-white/50 uppercase tracking-wider">Top AI Suggestions</h3>
              <ul className="space-y-4">
                {briefing?.suggestions?.map((sug, idx) => (
                  <motion.li 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    key={idx} 
                    className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="text-white/90">{sug}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Optimized Schedule */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Activity className="text-purple-400" />
              Weather-Optimized Schedule
            </h2>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-white/10"></div>
              
              <div className="space-y-8">
                {briefing?.schedule?.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    key={idx} 
                    className="relative flex items-center gap-8 z-10"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                      {idx === 0 ? <Sunrise className="w-7 h-7 text-yellow-400" /> : 
                       idx === 1 ? <Coffee className="w-7 h-7 text-orange-400" /> : 
                       <Activity className="w-7 h-7 text-cyan-400" />}
                    </div>
                    <div className="glass flex-1 rounded-2xl p-6 border-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-sm font-bold text-purple-400 mb-1">{item.time}</div>
                      <div className="text-xl text-white/90">{item.activity}</div>
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
