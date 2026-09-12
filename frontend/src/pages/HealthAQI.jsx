import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartPulse, Wind, ThermometerSun, AlertCircle, 
  Baby, Users, ActivitySquare, Briefcase, Info, RefreshCw, Sparkles 
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { getAQIStatus } from '../utils/aqiUtils';

const HealthAQI = () => {
  const { weather, airQuality, loading, requestLocation } = useWeather();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#C5A880] border-t-transparent"></div>
      </div>
    );
  }

  const aqiVal = airQuality?.list?.[0]?.main?.aqi;
  const components = airQuality?.list?.[0]?.components;
  const aqiStatus = aqiVal !== undefined && aqiVal !== null ? getAQIStatus(aqiVal, components) : null;

  if (!aqiStatus) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center relative z-10">
        <div className="luxury-panel rounded-3xl p-12 max-w-lg mx-auto flex flex-col items-center shadow-md">
          <AlertCircle className="w-12 h-12 text-[#C68A4C] mb-4" />
          <h2 className="text-2xl font-editorial font-bold mb-2 text-[#1C1917]">Atmospheric Air Telemetry Nominal</h2>
          <p className="text-xs text-[#786E65] mb-6 leading-relaxed max-w-sm">
            Detailed particulate telemetry synchronizing. Ensure geographic coordinates are permitted.
          </p>
          <button 
            onClick={requestLocation}
            className="luxury-gold-btn px-6 py-2.5 rounded-full text-xs font-roman tracking-wider font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            SYNCHRONIZE SENSORS
          </button>
        </div>
      </div>
    );
  }

  const uv = weather?.uv !== undefined ? weather.uv : 4.5;
  const percentage = Math.min((aqiStatus.value / 300) * 100, 100);

  const pollutants = [
    { name: 'PM2.5', value: components?.pm2_5, unit: 'μg/m³', desc: 'Fine respirable particles', threshold: 12, max: 75 },
    { name: 'PM10', value: components?.pm10, unit: 'μg/m³', desc: 'Inhalable coarse dust', threshold: 54, max: 150 },
    { name: 'CO', value: components?.co ? (components.co / 1000).toFixed(2) : undefined, unit: 'mg/m³', desc: 'Carbon Monoxide', threshold: 4.4, max: 15.4 },
    { name: 'NO2', value: components?.no2, unit: 'μg/m³', desc: 'Nitrogen Dioxide', threshold: 40, max: 200 },
    { name: 'O3', value: components?.o3, unit: 'μg/m³', desc: 'Ground-level Ozone', threshold: 100, max: 180 }
  ];

  const getSafetyAdvice = () => {
    const idx = aqiStatus.index;
    if (idx === 1) {
      return {
        children: { status: 'OPTIMAL', color: 'text-[#4E7D63] border-[#4E7D63]/30 bg-[#4E7D63]/10', text: 'Air is pristine. Ideal atmospheric conditions for vigorous outdoor pursuits and children.' },
        elderly: { status: 'OPTIMAL', color: 'text-[#4E7D63] border-[#4E7D63]/30 bg-[#4E7D63]/10', text: 'Nominal respiratory parameters. Superb for walks, recreation, and open-air leisure.' },
        asthma: { status: 'OPTIMAL', color: 'text-[#4E7D63] border-[#4E7D63]/30 bg-[#4E7D63]/10', text: 'Zero particulate distress expected. Standard health baseline maintained.' },
        workers: { status: 'OPTIMAL', color: 'text-[#4E7D63] border-[#4E7D63]/30 bg-[#4E7D63]/10', text: 'Uncompromised oxygenation for extended physical outdoor activities.' }
      };
    }
    if (idx === 2) {
      return {
        children: { status: 'MODERATE', color: 'text-[#C68A4C] border-[#C68A4C]/30 bg-[#C68A4C]/10', text: 'Acceptable baseline. Monitor individuals with acute respiratory predispositions.' },
        elderly: { status: 'OPTIMAL', color: 'text-[#4E7D63] border-[#4E7D63]/30 bg-[#4E7D63]/10', text: 'Conditions remain favorable for moderate outdoor recreation.' },
        asthma: { status: 'MINOR CAUTION', color: 'text-[#C68A4C] border-[#C68A4C]/30 bg-[#C68A4C]/10', text: 'Maintain personal preventative inhalers nearby during prolonged outdoor exposure.' },
        workers: { status: 'OPTIMAL', color: 'text-[#4E7D63] border-[#4E7D63]/30 bg-[#4E7D63]/10', text: 'Standard operational protocol applies across shifts.' }
      };
    }
    if (idx === 3) {
      return {
        children: { status: 'CAUTION', color: 'text-[#C68A4C] border-[#C68A4C]/30 bg-[#C68A4C]/10', text: 'Limit prolonged outdoor athletic exertion; favor indoor climate-controlled spaces.' },
        elderly: { status: 'CAUTION', color: 'text-[#C68A4C] border-[#C68A4C]/30 bg-[#C68A4C]/10', text: 'Curtail heavy physical exertion outdoors; rest in purified atmospheres.' },
        asthma: { status: 'ELEVATED RISK', color: 'text-[#B35446] border-[#B35446]/30 bg-[#B35446]/10', text: 'Elevated particle presence. Minimize aerobic activities outside.' },
        workers: { status: 'CAUTION', color: 'text-[#C68A4C] border-[#C68A4C]/30 bg-[#C68A4C]/10', text: 'Increase hydration frequency and take shaded, filtered rest intervals.' }
      };
    }
    return {
      children: { status: 'STAY INDOORS', color: 'text-[#B35446] border-[#B35446]/30 bg-[#B35446]/10', text: 'Strictly maintain children in air-purified interior architecture.' },
      elderly: { status: 'HIGH RISK', color: 'text-[#B35446] border-[#B35446]/30 bg-[#B35446]/10', text: 'Restrict all outdoor exposures; seal perimeter windows and activate HEPA filtration.' },
      asthma: { status: 'CRITICAL RISK', color: 'text-[#B35446] border-[#B35446]/30 bg-[#B35446]/10', text: 'Immediate susceptibility to bronchospasm. Avoid unconditioned air.' },
      workers: { status: 'HIGH RISK', color: 'text-[#B35446] border-[#B35446]/30 bg-[#B35446]/10', text: 'Cease non-essential outdoor work or mandate high-grade N95 filtration respirators.' }
    };
  };

  const advice = getSafetyAdvice();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
      
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#C5A880]/20">
        <div>
          <span className="text-[10px] font-roman tracking-[0.25em] text-[#8C6D3F] uppercase block mb-1">
            ENVIRONMENTAL MEDICINE & DIAGNOSTICS
          </span>
          <h1 className="text-3xl md:text-4xl font-editorial font-bold text-[#1C1917] tracking-tight">
            Air Diagnostics & Health Guardian
          </h1>
          <p className="text-xs text-[#57493A] font-medium mt-1">
            Real-time biometric & atmospheric safety analytics calibrated to EPA standards.
          </p>
        </div>

        <div className="px-4 py-2 rounded-full bg-white/90 border border-[#C5A880]/30 shadow-xs flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping" />
          <span className="text-[11px] font-roman tracking-wider text-[#6B5E51] uppercase">
            STATION: {weather?.name || 'LOCAL NODE'}
          </span>
        </div>
      </div>

      {/* Primary AQI & UV Complications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Main AQI Diagnostic Instrument */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="luxury-panel rounded-3xl p-6 md:p-8 col-span-1 md:col-span-2 shadow-md flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] font-roman text-[#786E65] tracking-widest uppercase block mb-0.5">
                AIR QUALITY INDEX
              </span>
              <h2 className="text-xl font-editorial font-bold text-[#1C1917]">
                Particulate Purity Meter
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-roman tracking-wider uppercase font-bold bg-[#FAF5ED] border border-[#C5A880]/40 text-[#8C6D3F]">
              {aqiStatus.readableLabel}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 my-4">
            <div className="text-center sm:text-left">
              <div className="text-6xl md:text-7xl font-editorial font-bold text-[#1C1917] tracking-tight leading-none">
                {aqiStatus.value}
              </div>
              <span className="text-[9px] font-roman tracking-widest text-[#786E65] uppercase mt-1 block">
                EPA US-AQI SCORE
              </span>
            </div>

            <div className="h-12 w-px bg-[#C5A880]/20 hidden sm:block" />

            <div className="flex-1 p-4 rounded-2xl bg-white/80 border border-[#C5A880]/25 shadow-xs">
              <span className="text-[9px] font-roman text-[#8C6D3F] uppercase tracking-widest block mb-1 font-bold">
                CLINICAL HEALTH ADVISORY:
              </span>
              <p className="text-xs text-[#443E38] font-medium leading-relaxed">
                "{aqiStatus.recommendation}"
              </p>
            </div>
          </div>

          {/* Calibrated Gauge Scale */}
          <div className="mt-6 pt-4 border-t border-[#C5A880]/20">
            <div className="flex justify-between text-[9px] font-roman text-[#786E65] mb-2 uppercase tracking-wider">
              <span>PRISTINE (0)</span>
              <span>MODERATE (100)</span>
              <span>UNHEALTHY (200)</span>
              <span>SEVERE (300+)</span>
            </div>
            <div className="relative h-2.5 w-full bg-[#FAF5ED] rounded-full border border-[#C5A880]/30 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#DFCCA6] via-[#C5A880] to-[#B89758] rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* UV Index Exposure Complication */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="luxury-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-md"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-roman text-[#786E65] tracking-widest uppercase">
                SOLAR EXPOSURE
              </span>
              <ThermometerSun className="w-5 h-5 text-[#C68A4C]" />
            </div>
            <h2 className="text-xl font-editorial font-bold text-[#1C1917] mb-2">
              UV Radiance
            </h2>
            <div className="text-4xl font-editorial font-bold text-[#1C1917] mt-2">
              {uv} <span className="text-sm font-roman text-[#8C6D3F]">MODERATE</span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-white/80 border border-[#C5A880]/25 shadow-xs text-xs text-[#57493A] font-medium leading-relaxed flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#B89758] shrink-0 mt-0.5" />
            <span>Standard solar defense advised. Apply broad-spectrum mineral protection for exposures exceeding 30 minutes.</span>
          </div>
        </motion.div>

      </div>

      {/* Particulate Pollutant Telemetry Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#C5A880]/20">
          <h2 className="text-lg font-editorial font-bold text-[#1C1917] flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#B89758]" />
            Atmospheric Chemical Speciation
          </h2>
          <span className="text-[10px] font-roman text-[#786E65] uppercase tracking-widest">
            REAL-TIME PARTICLE DENSITY
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {pollutants.map((pol, idx) => (
            <motion.div
              key={pol.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="luxury-card-3d p-4 rounded-2xl flex flex-col justify-between shadow-xs"
            >
              <div>
                <span className="text-sm font-bold text-[#1C1917] block">{pol.name}</span>
                <span className="text-[10px] text-[#786E65] leading-tight block mb-2">{pol.desc}</span>
              </div>
              <div>
                <div className="text-xl font-editorial font-bold text-[#1C1917]">
                  {pol.value !== undefined ? pol.value : 'N/A'}{' '}
                  <span className="text-[10px] font-roman text-[#786E65]">{pol.unit}</span>
                </div>
                <div className="mt-2 h-1.5 w-full bg-[#FAF5ED] rounded-full overflow-hidden border border-[#C5A880]/20">
                  <div 
                    className="h-full bg-[#B89758] rounded-full"
                    style={{ width: pol.value !== undefined ? `${Math.min((parseFloat(pol.value) / pol.max) * 100, 100)}%` : '0%' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demographic Health Advisories */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#C5A880]/20">
          <h2 className="text-lg font-editorial font-bold text-[#1C1917] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B89758]" />
            Demographic Vulnerability Profiles
          </h2>
          <span className="text-[10px] font-roman text-[#786E65] uppercase tracking-widest">
            TAILORED PROTOCOLS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="luxury-panel p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <Baby className="w-5 h-5 text-[#8C6D3F]" />
              <span className={`text-[9px] font-roman font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${advice.children.color}`}>
                {advice.children.status}
              </span>
            </div>
            <span className="text-xs font-bold text-[#1C1917] block mb-1">Pediatric Vulnerability</span>
            <p className="text-xs text-[#57493A] font-medium leading-relaxed">{advice.children.text}</p>
          </div>

          <div className="luxury-panel p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-5 h-5 text-[#8C6D3F]" />
              <span className={`text-[9px] font-roman font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${advice.elderly.color}`}>
                {advice.elderly.status}
              </span>
            </div>
            <span className="text-xs font-bold text-[#1C1917] block mb-1">Senior Citizens</span>
            <p className="text-xs text-[#57493A] font-medium leading-relaxed">{advice.elderly.text}</p>
          </div>

          <div className="luxury-panel p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <ActivitySquare className="w-5 h-5 text-[#8C6D3F]" />
              <span className={`text-[9px] font-roman font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${advice.asthma.color}`}>
                {advice.asthma.status}
              </span>
            </div>
            <span className="text-xs font-bold text-[#1C1917] block mb-1">Respiratory Sensitivity</span>
            <p className="text-xs text-[#57493A] font-medium leading-relaxed">{advice.asthma.text}</p>
          </div>

          <div className="luxury-panel p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <Briefcase className="w-5 h-5 text-[#8C6D3F]" />
              <span className={`text-[9px] font-roman font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${advice.workers.color}`}>
                {advice.workers.status}
              </span>
            </div>
            <span className="text-xs font-bold text-[#1C1917] block mb-1">Outdoor Professionals</span>
            <p className="text-xs text-[#57493A] font-medium leading-relaxed">{advice.workers.text}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HealthAQI;
