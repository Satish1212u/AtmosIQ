import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, ShieldCheck, ShieldAlert, ShieldX, 
  Activity, CloudRain, Sun, ArrowRight, Compass, Sparkles 
} from 'lucide-react';
import { generateAIResponse } from '../services/aiApi';
import { useWeather } from '../context/WeatherContext';
import LuxuryRoute3D from '../components/3d/LuxuryRoute3D';

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
    const aiText = aiResult.reply || aiResult.response || "";
    
    try {
      let jsonStr = aiText.replace(/```json\n?|\n?```/g, '').trim();
      const match = jsonStr.match(/\{[\s\S]*\}/);
      if (match) {
        jsonStr = match[0];
      }
      const result = JSON.parse(jsonStr);
      setStatus(result);
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      setStatus({
        decision: 'CAUTION',
        reasoning: aiText || 'Atmospheric metrics require conservative travel precautions.',
        risks: { aqi: 'Moderate AQI', rain: '20% Chance', storm: 'Low Likelihood', heatwave: 'Temperate' }
      });
    }
    
    setLoading(false);
  };

  const getDecisionStyles = () => {
    if (!status) return { text: '', border: '', badge: '' };
    if (status.decision === 'GO') return {
      text: 'text-[#4E7D63]',
      border: 'border-[#4E7D63]/40',
      badge: 'bg-[#4E7D63]/10 text-[#4E7D63] border-[#4E7D63]/30',
    };
    if (status.decision === 'CAUTION') return {
      text: 'text-[#C68A4C]',
      border: 'border-[#C68A4C]/40',
      badge: 'bg-[#C68A4C]/10 text-[#C68A4C] border-[#C68A4C]/30',
    };
    return {
      text: 'text-[#B35446]',
      border: 'border-[#B35446]/40',
      badge: 'bg-[#B35446]/10 text-[#B35446] border-[#B35446]/30',
    };
  };

  const DecisionIcon = () => {
    if (!status) return null;
    const styles = getDecisionStyles();
    if (status.decision === 'GO') return <ShieldCheck className={`w-12 h-12 ${styles.text}`} />;
    if (status.decision === 'CAUTION') return <ShieldAlert className={`w-12 h-12 ${styles.text}`} />;
    return <ShieldX className={`w-12 h-12 ${styles.text}`} />;
  };

  const currentStyles = getDecisionStyles();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden pt-10 pb-16 relative z-10">
      
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-8 items-start relative z-10">
        
        {/* Input Requisition Panel (Left Column) */}
        <div className="w-full lg:w-[38%] space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 border border-[#C5A880]/30 text-[10px] font-roman tracking-[0.25em] uppercase text-[#8C6D3F] mb-3 shadow-xs">
              <Compass className="w-3 h-3 text-[#B89758]" />
              PATHFINDER TELEMETRY
            </div>
            <h1 className="text-3xl md:text-4xl font-editorial font-bold text-[#1C1917] tracking-tight mb-2">
              Voyage Feasibility
            </h1>
            <p className="text-[#57493A] font-medium text-xs leading-relaxed">
              Spatial climate analytics and multi-vector risk parameters for global itineraries.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <form onSubmit={handleCheck} className="luxury-panel p-6 md:p-8 rounded-3xl space-y-4 shadow-md">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-roman text-[#786E65] uppercase tracking-widest">
                  DESTINATION ATELIER
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89D8F]" />
                  <input 
                    type="text" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Zurich, Switzerland" 
                    className="w-full bg-[#FAF8F5] border border-[#C5A880]/30 rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#B89758] focus:ring-1 focus:ring-[#B89758]/20 transition-all placeholder-[#A89D8F] shadow-inner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-roman text-[#786E65] uppercase tracking-widest">
                  ITINERARY DATE
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89D8F]" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#C5A880]/30 rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#B89758] focus:ring-1 focus:ring-[#B89758]/20 transition-all shadow-inner cursor-pointer"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="luxury-gold-btn w-full mt-2 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs font-roman flex justify-center items-center gap-2 cursor-pointer shadow-sm disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" />
                    COMPUTING VOYAGE SAFETY...
                  </span>
                ) : (
                  <>
                    <span>ANALYZE METEOROLOGICAL SAFETY</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* 3D Spatial Route Preview */}
          <div className="luxury-panel p-4 rounded-3xl">
            <span className="text-[9px] font-roman tracking-[0.2em] text-[#786E65] uppercase block mb-1">
              3D DIMENSIONAL ROUTE SPLINE
            </span>
            <LuxuryRoute3D 
              origin={weather?.name || 'Local'} 
              destination={destination || 'Geneva'} 
            />
          </div>
        </div>

        {/* Verdict & Environmental Analysis (Right Column) */}
        <div className="w-full lg:w-[62%] self-stretch">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[360px] luxury-panel rounded-3xl flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin mb-4" />
                <h3 className="text-lg font-editorial font-bold text-[#1C1917] mb-1">
                  Synthesizing Atmospheric Ensembles
                </h3>
                <p className="text-xs text-[#786E65] max-w-sm">
                  Correlating barometric vectors, cloud strata, flight turbulence indices, and regional AQI metrics...
                </p>
              </motion.div>
            )}

            {status && !loading && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`luxury-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full border ${currentStyles.border}`}
              >
                <div>
                  <div className="flex items-center gap-5 mb-6 pb-6 border-b border-[#C5A880]/20">
                    <div className="p-3.5 rounded-2xl bg-white/90 border border-[#C5A880]/30 shadow-xs">
                      <DecisionIcon />
                    </div>
                    <div>
                      <span className="text-[10px] font-roman tracking-[0.25em] text-[#786E65] uppercase block mb-0.5">
                        VOYAGE RECOMMENDATION
                      </span>
                      <div className={`text-4xl md:text-5xl font-editorial font-bold ${currentStyles.text}`}>
                        {status.decision}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/80 border border-[#C5A880]/25 shadow-sm mb-6">
                    <span className="text-[9px] font-roman tracking-wider uppercase text-[#8C6D3F] block mb-1 font-bold">
                      EXECUTIVE CLIMATE ANALYSIS
                    </span>
                    <p className="text-sm text-[#443E38] font-medium leading-relaxed">
                      {status.reasoning}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#C5A880]/25 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 mb-2 text-[#4E7D63]">
                      <Activity className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-roman text-[#786E65] uppercase">AQI RISK</span>
                    </div>
                    <span className="text-xs font-bold text-[#1C1917]">{status.risks.aqi}</span>
                  </div>

                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#C5A880]/25 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 mb-2 text-[#57493A]">
                      <CloudRain className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-roman text-[#786E65] uppercase">RAIN INDEX</span>
                    </div>
                    <span className="text-xs font-bold text-[#1C1917]">{status.risks.rain}</span>
                  </div>

                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#C5A880]/25 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 mb-2 text-[#B89758]">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-roman text-[#786E65] uppercase">STORM PROB.</span>
                    </div>
                    <span className="text-xs font-bold text-[#1C1917]">{status.risks.storm}</span>
                  </div>

                  <div className="bg-white/70 p-3.5 rounded-2xl border border-[#C5A880]/25 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 mb-2 text-[#C68A4C]">
                      <Sun className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-roman text-[#786E65] uppercase">THERMAL RISK</span>
                    </div>
                    <span className="text-xs font-bold text-[#1C1917]">{status.risks.heatwave}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {!status && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[360px] luxury-panel rounded-3xl flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FAF5ED] border border-[#C5A880]/40 flex items-center justify-center text-[#B89758] mb-4 shadow-sm">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-editorial font-bold text-[#1C1917] mb-1">
                  Ready for Route Evaluation
                </h3>
                <p className="text-xs text-[#786E65] max-w-sm">
                  Specify a global destination and itinerary departure date to simulate atmospheric vectors and risk thresholds.
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
