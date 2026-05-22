import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, ShieldCheck, ShieldAlert, ShieldX, 
  Activity, CloudRain, Sun, ArrowRight, Compass 
} from 'lucide-react';
import { generateAIResponse } from '../services/aiApi';
import { useWeather } from '../context/WeatherContext';

const TravelChecker = () => {
  const { weather, airQuality } = useWeather();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!destination || !date) return;

    setLoading(true);
    setStatus(null);

    const prompt = `Analyze travel safety for ${destination} on ${date}. Return ONLY a JSON object with this exact structure (no markdown block, just raw JSON): { "decision": "GO" | "CAUTION" | "AVOID", "reasoning": "brief explanation", "risks": { "aqi": "string", "rain": "string", "storm": "string", "heatwave": "string" } }`;
    
    const aiResult = await generateAIResponse(prompt, weather, airQuality);
    const aiText = aiResult.response || "";
    
    try {
      const cleanedText = aiText.replace(/```json\n?|\n?```/g, '').trim();
      const result = JSON.parse(cleanedText);
      setStatus(result);
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      setStatus({
        decision: 'CAUTION',
        reasoning: aiText || 'Unable to parse AI response.',
        risks: { aqi: 'Unknown Risk', rain: 'Unknown Chance', storm: 'Unknown Storm', heatwave: 'Unknown Heat' }
      });
    }
    
    setLoading(false);
  };

  const getDecisionStyles = () => {
    if (!status) return { card: '', text: '', iconBg: '' };
    if (status.decision === 'GO') return {
      card: 'from-emerald-950/40 via-slate-900/60 to-slate-900/80 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)]',
      text: 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]',
      iconBg: 'bg-emerald-500/10 border border-emerald-500/30'
    };
    if (status.decision === 'CAUTION') return {
      card: 'from-yellow-950/40 via-slate-900/60 to-slate-900/80 border-yellow-500/40 shadow-[0_0_40px_rgba(234,179,8,0.15)]',
      text: 'text-yellow-400 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]',
      iconBg: 'bg-yellow-500/10 border border-yellow-500/30'
    };
    return {
      card: 'from-rose-950/40 via-slate-900/60 to-slate-900/80 border-rose-500/40 shadow-[0_0_40px_rgba(244,63,94,0.15)]',
      text: 'text-rose-400 drop-shadow-[0_0_15px_rgba(251,113,133,0.5)]',
      iconBg: 'bg-rose-500/10 border border-rose-500/30'
    };
  };

  const DecisionIcon = () => {
    if (!status) return null;
    const styles = getDecisionStyles();
    if (status.decision === 'GO') return <ShieldCheck className={`w-14 h-14 ${styles.text}`} />;
    if (status.decision === 'CAUTION') return <ShieldAlert className={`w-14 h-14 ${styles.text}`} />;
    return <ShieldX className={`w-14 h-14 ${styles.text}`} />;
  };

  const currentStyles = getDecisionStyles();

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white overflow-x-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container with responsive padding clearing the header/navbar */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-16 flex flex-col lg:flex-row gap-8 items-start relative z-10">
        
        {/* Input Section (Left Column) */}
        <div className="w-full lg:w-[35%] space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 mb-3 shadow-md backdrop-blur-md">
              <Compass className="w-3 h-3 animate-spin-slow" />
              Pathfinder Telemetry
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200 uppercase font-mono">
              AtmosIQ Pathfinder
            </h1>
            <p className="text-slate-200 font-semibold text-sm leading-relaxed">
              AI-powered climate safety and environmental risk parameters for global routes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <form onSubmit={handleCheck} className="glass p-6 md:p-8 rounded-[2rem] space-y-5 border border-white/15 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900/40">
              {/* Card glowing edge */}
              <div className="absolute -inset-x-20 -top-20 h-40 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl pointer-events-none group-hover:from-cyan-500/20 transition-all duration-700" />
              
              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold text-slate-200 uppercase tracking-widest">Destination</label>
                <div className="relative group/input">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-cyan-400 transition-colors" />
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Tokyo, Japan" 
                    className="w-full bg-slate-950/80 border border-white/25 hover:border-cyan-400 focus:border-cyan-400 rounded-2xl py-3.5 pl-12 pr-4 text-white font-semibold focus:outline-none transition-all duration-300 shadow-inner placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold text-slate-200 uppercase tracking-widest">Travel Date</label>
                <div className="relative group/date">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover/date:text-cyan-400 transition-colors" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950/80 border border-white/25 hover:border-cyan-400 focus:border-cyan-400 rounded-2xl py-3.5 pl-12 pr-4 text-white font-semibold focus:outline-none transition-all duration-300 [color-scheme:dark] shadow-inner cursor-pointer"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black uppercase tracking-wider hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2 animate-pulse">
                    <Activity className="w-5 h-5 animate-spin" />
                    Analyzing Telemetry...
                  </span>
                ) : (
                  <>
                    <span>Analyze Safety</span>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Result Section (Right Column) */}
        <div className="w-full lg:w-[65%] self-stretch">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[350px] glass rounded-[2.5rem] flex flex-col items-center justify-center border border-white/10 p-8"
              >
                <div className="relative w-28 h-28 mb-6">
                  <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-3 border-r-4 border-blue-500 rounded-full animate-spin-reverse"></div>
                  <Activity className="absolute inset-0 m-auto text-cyan-300 w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold mb-2">Simulating Environmental Hazards</h3>
                <p className="text-white/50 text-sm text-center max-w-sm">
                  AI Orchestrator is scanning multiple atmospheric vectors, AQI thresholds, and local flight warnings...
                </p>
              </motion.div>
            )}

            {status && !loading && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className={`glass border border-white/15 rounded-[2.5rem] p-6 md:p-8 bg-gradient-to-br ${currentStyles.card} flex flex-col justify-between h-full`}
              >
                <div>
                  <div className="flex items-center gap-6 mb-8 border-b border-white/15 pb-6">
                    <div className={`p-4 rounded-2xl backdrop-blur-md shadow-inner ${currentStyles.iconBg}`}>
                      <DecisionIcon />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-200 font-black mb-1">AI Verdict Core</div>
                      <div className={`text-4xl md:text-5xl font-black ${currentStyles.text}`}>{status.decision}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${status.decision === 'GO' ? 'bg-emerald-500' : status.decision === 'CAUTION' ? 'bg-yellow-500' : 'bg-rose-500'}`} />
                    <h3 className={`font-black mb-2 text-xs uppercase tracking-widest ${status.decision === 'GO' ? 'text-emerald-400 font-black' : status.decision === 'CAUTION' ? 'text-yellow-400 font-black' : 'text-rose-400 font-black'}`}>
                      Decryption & Analysis
                    </h3>
                    <p className="text-slate-100 leading-relaxed font-semibold text-[15px]">{status.reasoning}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* AQI Risk Card */}
                  <div className="bg-slate-950/80 hover:bg-slate-950 border border-white/15 hover:border-cyan-400/80 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 group/card relative overflow-hidden h-full shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover/card:scale-110 transition-all duration-300">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-slate-200 font-black uppercase tracking-wider">AQI Risk</span>
                    </div>
                    <div className="text-sm font-black text-white leading-tight group-hover/card:text-cyan-300 transition-colors">
                      {status.risks.aqi}
                    </div>
                  </div>

                  {/* Rain Card */}
                  <div className="bg-slate-950/80 hover:bg-slate-950 border border-white/15 hover:border-cyan-400/80 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 group/card relative overflow-hidden h-full shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover/card:scale-110 transition-all duration-300">
                        <CloudRain className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-slate-200 font-black uppercase tracking-wider">Rain Risk</span>
                    </div>
                    <div className="text-sm font-black text-white leading-tight group-hover/card:text-blue-300 transition-colors">
                      {status.risks.rain}
                    </div>
                  </div>

                  {/* Storm Card */}
                  <div className="bg-slate-950/80 hover:bg-slate-950 border border-white/15 hover:border-cyan-400/80 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 group/card relative overflow-hidden h-full shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover/card:scale-110 transition-all duration-300">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-slate-200 font-black uppercase tracking-wider">Storm Prob.</span>
                    </div>
                    <div className="text-sm font-black text-white leading-tight group-hover/card:text-purple-300 transition-colors">
                      {status.risks.storm}
                    </div>
                  </div>

                  {/* Heatwave Card */}
                  <div className="bg-slate-950/80 hover:bg-slate-950 border border-white/15 hover:border-cyan-400/80 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 group/card relative overflow-hidden h-full shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 group-hover/card:scale-110 transition-all duration-300">
                        <Sun className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-slate-200 font-black uppercase tracking-wider">Heatwave</span>
                    </div>
                    <div className="text-sm font-black text-white leading-tight group-hover/card:text-orange-300 transition-colors">
                      {status.risks.heatwave}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!status && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[350px] glass rounded-[2.5rem] flex flex-col items-center justify-center border border-white/15 p-8 opacity-90 hover:opacity-100 transition-opacity duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.4)] bg-slate-900/40"
              >
                <div className="p-5 rounded-3xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-6 shadow-inner animate-pulse">
                  <Compass className="w-16 h-16" />
                </div>
                <h3 className="text-2xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">Initialize Navigation Panel</h3>
                <p className="text-slate-200 font-semibold text-sm text-center max-w-sm leading-relaxed">
                  Provide your target destination and departure coordinates to synchronize risk mitigation parameters.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};

export default TravelChecker;
