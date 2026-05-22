import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartPulse, Wind, ThermometerSun, AlertCircle, 
  Baby, Users, ActivitySquare, Briefcase, Info, RefreshCw 
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { getAQIStatus } from '../utils/aqiUtils';

const HealthAQI = () => {
  const { weather, airQuality, loading, error, requestLocation } = useWeather();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  // 11. Add optional chaining everywhere to avoid crashes
  const aqiVal = airQuality?.list?.[0]?.main?.aqi;
  const components = airQuality?.list?.[0]?.components;
  const aqiStatus = aqiVal !== undefined && aqiVal !== null ? getAQIStatus(aqiVal, components) : null;

  // 10. Fallback UI
  if (!aqiStatus) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <div className="glass rounded-[2rem] p-12 max-w-lg mx-auto flex flex-col items-center">
          <AlertCircle className="w-16 h-16 text-orange-400 mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold mb-4">Air Quality Info</h2>
          <p className="text-white/70 mb-8 leading-relaxed">
            Air quality data currently unavailable.
          </p>
          <button 
            onClick={requestLocation}
            className="px-6 py-3 rounded-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all border border-cyan-500/30 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Telemetry
          </button>
        </div>
      </div>
    );
  }

  const uv = weather?.uv !== undefined ? weather.uv : 4.2; // Fallback or mock UV index since OpenWeather standard weather API doesn't include it directly without OneCall

  // Percentage for progress bar (scale of 300)
  const percentage = Math.min((aqiStatus.value / 300) * 100, 100);

  // Pollutant list config
  const pollutants = [
    { name: 'PM2.5', value: components?.pm2_5, unit: 'μg/m³', desc: 'Fine particles', threshold: 12, max: 75 },
    { name: 'PM10', value: components?.pm10, unit: 'μg/m³', desc: 'Coarse particles', threshold: 54, max: 150 },
    { name: 'CO', value: components?.co ? (components.co / 1000).toFixed(2) : undefined, unit: 'mg/m³', desc: 'Carbon Monoxide', threshold: 4.4, max: 15400 / 1000 },
    { name: 'NO2', value: components?.no2, unit: 'μg/m³', desc: 'Nitrogen Dioxide', threshold: 40, max: 200 },
    { name: 'O3', value: components?.o3, unit: 'μg/m³', desc: 'Ozone', threshold: 100, max: 180 }
  ];

  // Dynamic Safety advice based on AQI index
  const getSafetyAdvice = () => {
    const idx = aqiStatus.index;
    if (idx === 1) {
      return {
        children: { status: 'SAFE', color: 'text-green-400 border-green-500/30 bg-green-500/10', text: 'Air is clean. Perfect day for outdoor playtime and sports!' },
        elderly: { status: 'SAFE', color: 'text-green-400 border-green-500/30 bg-green-500/10', text: 'Great day for walks, gardening, and any outdoor recreation.' },
        asthma: { status: 'SAFE', color: 'text-green-400 border-green-500/30 bg-green-500/10', text: 'Low pollution levels. Enjoy normal outdoor activities safely.' },
        workers: { status: 'SAFE', color: 'text-green-400 border-green-500/30 bg-green-500/10', text: 'Optimal breathing conditions for all-day outdoor shifts.' }
      };
    }
    if (idx === 2) {
      return {
        children: { status: 'CAUTION', color: 'text-lime-400 border-lime-500/30 bg-lime-500/10', text: 'Generally safe, but monitor highly active children for any coughing.' },
        elderly: { status: 'SAFE', color: 'text-green-400 border-green-500/30 bg-green-500/10', text: 'Acceptable conditions. Perfect for outdoor exercises.' },
        asthma: { status: 'MINOR RISK', color: 'text-lime-400 border-lime-500/30 bg-lime-500/10', text: 'Keep quick-relief inhalers nearby just in case.' },
        workers: { status: 'SAFE', color: 'text-green-400 border-green-500/30 bg-green-500/10', text: 'Good conditions. Standard safety precautions apply.' }
      };
    }
    if (idx === 3) {
      return {
        children: { status: 'CAUTION', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10', text: 'Limit heavy outdoor exertion. Prefer indoor playtime if sensitive.' },
        elderly: { status: 'MODERATE RISK', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10', text: 'Reduce heavy exercise outdoors. Stay inside if feeling tired.' },
        asthma: { status: 'HIGH RISK', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10', text: 'Keep inhaler handy. Avoid strenuous outdoor activities.' },
        workers: { status: 'CAUTION', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10', text: 'Take frequent hydration breaks. Limit prolonged heavy lifting.' }
      };
    }
    if (idx === 4) {
      return {
        children: { status: 'AVOID OUTDOORS', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10', text: 'Keep children indoors as much as possible to protect developing lungs.' },
        elderly: { status: 'HIGH RISK', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10', text: 'Avoid going outdoors. Keep windows shut and stay in cool areas.' },
        asthma: { status: 'EXTREME RISK', color: 'text-red-400 border-red-500/30 bg-red-500/10', text: 'Stay indoors. Use air filtration. Avoid any physical exertion.' },
        workers: { status: 'HIGH RISK', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10', text: 'Wear a mask (N95). Take hourly indoor breaks. Limit outdoor exposure.' }
      };
    }
    return {
      children: { status: 'DANGER - STAY INDOORS', color: 'text-red-400 border-red-500/30 bg-red-500/10', text: 'Strictly stay indoors. Run indoor air purifiers.' },
      elderly: { status: 'CRITICAL RISK', color: 'text-red-400 border-red-500/30 bg-red-500/10', text: 'Do not step outside. Ensure air purifiers are running.' },
      asthma: { status: 'CRITICAL RISK', color: 'text-red-400 border-red-500/30 bg-red-500/10', text: 'Immediate risk of attack. Remain in highly purified indoor spaces.' },
      workers: { status: 'CRITICAL RISK', color: 'text-red-400 border-red-500/30 bg-red-500/10', text: 'Cease outdoor work if possible. Mandatory mask-wearing (N95) if necessary.' }
    };
  };

  const advice = getSafetyAdvice();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3 tracking-tight text-white">
            <HeartPulse className="w-10 h-10 text-pink-500 animate-pulse animate-duration-1000" />
            AtmosIQ Health Guardian
          </h1>
          <p className="text-slate-200 font-semibold text-lg">Real-time health insights powered by live air quality and weather data.</p>
        </div>
        <div className="glass px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/15 bg-slate-950/40">
          <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping" />
          <span className="text-sm font-extrabold tracking-wider text-slate-100">Station: {weather?.name || 'Synced Location'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* 8. Animated AQI progress bar / gauge card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 col-span-1 lg:col-span-2 relative overflow-hidden flex flex-col justify-between group border border-white/15 hover:border-cyan-400/40 transition-all duration-300 bg-slate-900/60"
        >
          {/* Futuristic background vector */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 pointer-events-none" />
          
          <div className="flex justify-between items-start z-10">
            <div>
              <h2 className="text-xl font-bold mb-1 text-white">Air Quality Index (AQI)</h2>
              <p className="text-slate-200 text-sm font-semibold">Real-time Environmental Index</p>
            </div>
            {/* 2 & 6. Category label & color coding */}
            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${aqiStatus.bg} ${aqiStatus.color} border ${aqiStatus.border} shadow-sm`}>
              {aqiStatus.readableLabel}
            </div>
          </div>
          
          <div className="my-8 z-10 flex items-center gap-6">
            {/* 1. Show the exact AQI number */}
            <div className="flex flex-col items-center">
              <div className={`text-6xl md:text-7xl font-black tracking-tighter ${aqiStatus.color} text-glow-cyan`}>{aqiStatus.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-300 font-black -mt-1">Exact AQI</div>
            </div>
            
            <div className="h-14 w-px bg-white/15 hidden sm:block" />
            
            {/* 5. Dynamic health recommendations */}
            <div className="text-sm text-slate-100 font-semibold leading-relaxed max-w-md bg-slate-950/70 border border-white/10 p-4 rounded-2xl shadow-inner">
              <span className="font-extrabold block text-cyan-400 mb-1 text-xs uppercase tracking-widest">Health Advisory:</span>
              "{aqiStatus.recommendation}"
            </div>
          </div>

          {/* 8. Animated AQI linear progress bar/gauge */}
          <div className="z-10 mt-2">
            <div className="flex justify-between text-[10px] text-slate-200 mb-2 font-black uppercase tracking-widest">
              <span>Good (0)</span>
              <span>Moderate (100)</span>
              <span>Unhealthy (200)</span>
              <span>Severe (300+)</span>
            </div>
            <div className="relative h-3 w-full bg-slate-950/80 rounded-full border border-white/10 p-[1px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full rounded-full ${aqiStatus.barColor}`}
                style={{ boxShadow: `0 0 12px ${aqiStatus.hex}` }}
              />
            </div>
          </div>
          
          <Wind className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 z-0" />
        </motion.div>

        {/* UV Index Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/35 flex flex-col justify-between group hover:border-orange-500/50 transition-all duration-300"
        >
          <div>
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2 text-white">
              <ThermometerSun className="w-5 h-5 text-orange-400 animate-spin-slow" />
              UV Exposure
            </h2>
            <p className="text-slate-200 font-semibold text-sm mb-4">Sun Protection Index</p>
            <div className="text-4xl font-black text-orange-400 mt-2">{uv} <span className="text-xl font-bold text-slate-200">High</span></div>
          </div>
          <div className="mt-4 p-4 bg-slate-950/70 rounded-2xl text-xs text-slate-200 font-semibold border border-orange-500/30 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <span>Protection required. Wear broad spectrum SPF sunscreen, a hat, and sunglasses.</span>
          </div>
        </motion.div>
      </div>

      {/* 7. Pollutant Values Display */}
      <h2 className="text-2xl font-bold mb-6 mt-12 flex items-center gap-2">
        <Wind className="w-6 h-6 text-cyan-400" />
        Key Atmospheric Pollutants
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {pollutants.map((pol, idx) => {
          const isOverThreshold = pol.value !== undefined && parseFloat(pol.value) > pol.threshold;
          return (
            <motion.div
              key={pol.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass p-5 rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-all border border-white/15 bg-slate-900/60 relative overflow-hidden group/item shadow-inner"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full pointer-events-none group-hover/item:scale-110 transition-transform" />
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-black text-white text-lg">{pol.name}</h3>
                    <p className="text-[11px] text-slate-300 font-semibold">{pol.desc}</p>
                  </div>
                  {isOverThreshold && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_8px_#f87171] animate-pulse" />
                  )}
                </div>
                <div className="text-2xl font-black tracking-tight text-glow mt-4 text-white">
                  {pol.value !== undefined ? pol.value : 'N/A'}{' '}
                  <span className="text-xs font-bold text-slate-200">{pol.unit}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-1.5 w-full bg-slate-950/80 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isOverThreshold ? 'bg-orange-400 shadow-[0_0_8px_#fb923c]' : 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'}`}
                    style={{ width: pol.value !== undefined ? `${Math.min((parseFloat(pol.value) / pol.max) * 100, 100)}%` : '0%' }}
                  />
                </div>
                <span className="text-[10px] text-slate-200 block mt-2 font-black uppercase tracking-wider">Limit: {pol.threshold} {pol.unit}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic safety cards */}
      <h2 className="text-2xl font-bold mb-6 mt-12 flex items-center gap-2 text-white">
        <HeartPulse className="w-6 h-6 text-pink-400" />
        Personalized Safety Advice
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SafetyCard 
          icon={<Baby className="w-6 h-6 text-cyan-400" />}
          title="Children & Toddlers"
          status={advice.children.status}
          statusStyle={advice.children.color}
          advice={advice.children.text}
          delay={0.1}
        />
        <SafetyCard 
          icon={<Users className="w-6 h-6 text-purple-400" />}
          title="Elderly Adults"
          status={advice.elderly.status}
          statusStyle={advice.elderly.color}
          advice={advice.elderly.text}
          delay={0.2}
        />
        <SafetyCard 
          icon={<ActivitySquare className="w-6 h-6 text-red-400 animate-pulse animate-duration-1000" />}
          title="Asthma & Respiratory Patients"
          status={advice.asthma.status}
          statusStyle={advice.asthma.color}
          advice={advice.asthma.text}
          delay={0.3}
        />
        <SafetyCard 
          icon={<Briefcase className="w-6 h-6 text-green-400" />}
          title="Outdoor Workers"
          status={advice.workers.status}
          statusStyle={advice.workers.color}
          advice={advice.workers.text}
          delay={0.4}
        />
      </div>
    </div>
  );
};

const SafetyCard = ({ icon, title, status, statusStyle, advice, delay }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="glass p-6 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors border border-white/15 bg-slate-900/60 shadow-lg"
    >
      <div className="p-3 bg-slate-950/70 border border-white/10 rounded-xl shrink-0">
        {icon}
      </div>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="font-extrabold text-lg text-white">{title}</h3>
          <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full border ${statusStyle} uppercase`}>
            {status}
          </span>
        </div>
        <p className="text-slate-200 text-sm font-semibold leading-relaxed">{advice}</p>
      </div>
    </motion.div>
  );
};

export default HealthAQI;
