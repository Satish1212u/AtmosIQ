import React from 'react';
import { motion } from 'framer-motion';

/* ══════════════════════════════════════════════════════════
   Weather condition → overlay CSS/animation config
   ══════════════════════════════════════════════════════════ */
const getWeatherOverlay = (condition, isNight) => {
  const c = (condition || 'clear').toLowerCase();

  if (isNight) return {
    gradient: 'bg-gradient-to-t from-slate-950/90 via-indigo-950/50 to-slate-900/30',
    tint: 'bg-indigo-900/20',
    particles: 'stars',
    label: 'Night Sky',
    labelColor: 'text-indigo-300',
  };

  if (c.includes('thunder') || c.includes('storm')) return {
    gradient: 'bg-gradient-to-t from-slate-950/95 via-purple-950/60 to-transparent',
    tint: 'bg-purple-900/25',
    particles: 'lightning',
    label: 'Thunderstorm',
    labelColor: 'text-purple-300',
  };

  if (c.includes('rain') || c.includes('drizzle')) return {
    gradient: 'bg-gradient-to-t from-slate-950/90 via-blue-950/50 to-transparent',
    tint: 'bg-blue-900/20',
    particles: 'rain',
    label: 'Rainy Conditions',
    labelColor: 'text-blue-300',
  };

  if (c.includes('snow') || c.includes('blizzard')) return {
    gradient: 'bg-gradient-to-t from-slate-950/85 via-slate-800/40 to-transparent',
    tint: 'bg-slate-500/10',
    particles: 'snow',
    label: 'Snowfall',
    labelColor: 'text-slate-300',
  };

  if (c.includes('fog') || c.includes('haze') || c.includes('mist') || c.includes('smoke')) return {
    gradient: 'bg-gradient-to-t from-slate-950/90 via-orange-950/30 to-transparent',
    tint: 'bg-amber-800/20',
    particles: 'fog',
    label: 'Hazy Conditions',
    labelColor: 'text-amber-300',
  };

  if (c.includes('cloud')) return {
    gradient: 'bg-gradient-to-t from-slate-950/85 via-slate-800/40 to-transparent',
    tint: 'bg-slate-700/15',
    particles: null,
    label: 'Overcast',
    labelColor: 'text-slate-300',
  };

  // Default — sunny/clear day
  return {
    gradient: 'bg-gradient-to-t from-slate-950/85 via-orange-950/25 to-transparent',
    tint: 'bg-amber-500/8',
    particles: 'sun',
    label: 'Clear Skies',
    labelColor: 'text-amber-300',
  };
};

/* ══════════════════════════════════════════════════════════
   RAIN PARTICLES
   ══════════════════════════════════════════════════════════ */
const RainParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes rain-fall {
        0% { transform: translateY(-20px) translateX(0); opacity: 0; }
        10% { opacity: 0.7; }
        90% { opacity: 0.5; }
        100% { transform: translateY(110%) translateX(-20px); opacity: 0; }
      }
    `}} />
    {Array.from({ length: 24 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-px rounded-full"
        style={{
          left: `${(i * 4.2) % 100}%`,
          top: '-20px',
          height: `${14 + (i % 8) * 3}px`,
          background: 'linear-gradient(to bottom, transparent, rgba(147,197,253,0.6))',
          animation: `rain-fall ${0.7 + (i % 5) * 0.18}s linear infinite`,
          animationDelay: `${(i * 0.13) % 1.2}s`,
        }}
      />
    ))}
    {/* Wet reflection shimmer at bottom */}
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-500/12 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
  </div>
);

/* ══════════════════════════════════════════════════════════
   SNOW PARTICLES
   ══════════════════════════════════════════════════════════ */
const SnowParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes snow-fall {
        0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.9; }
        100% { transform: translateY(110%) translateX(30px) rotate(360deg); opacity: 0; }
      }
    `}} />
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white/70"
        style={{
          left: `${(i * 5.1) % 100}%`,
          top: '-10px',
          width: `${3 + (i % 4)}px`,
          height: `${3 + (i % 4)}px`,
          animation: `snow-fall ${2.5 + (i % 5) * 0.6}s ease-in infinite`,
          animationDelay: `${(i * 0.3) % 3}s`,
        }}
      />
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════
   STARS (NIGHT)
   ══════════════════════════════════════════════════════════ */
const StarParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 30 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          left: `${(i * 3.37 + 2) % 100}%`,
          top: `${(i * 2.81 + 1) % 60}%`,
          width: `${1 + (i % 3)}px`,
          height: `${1 + (i % 3)}px`,
          opacity: 0.4 + (i % 5) * 0.12,
          animation: `pulse ${2 + (i % 4)}s ease-in-out infinite`,
          animationDelay: `${(i * 0.4) % 3}s`,
        }}
      />
    ))}
    {/* Moon glow */}
    <div className="absolute top-6 right-10 w-12 h-12 rounded-full bg-amber-100/20 blur-xl animate-pulse" style={{ animationDuration: '4s' }} />
  </div>
);

/* ══════════════════════════════════════════════════════════
   SUN BLOOM (CLEAR DAY)
   ══════════════════════════════════════════════════════════ */
const SunBloom = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] bg-amber-400/30 -translate-y-1/4 translate-x-1/4"
    />
    <div className="absolute top-8 right-12 w-4 h-4 rounded-full bg-amber-300/40 blur-sm animate-pulse" style={{ animationDuration: '3s' }} />
  </div>
);

/* ══════════════════════════════════════════════════════════
   FOG OVERLAY
   ══════════════════════════════════════════════════════════ */
const FogOverlay = () => (
  <motion.div
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-orange-100/10 to-amber-200/15 backdrop-blur-[1px]"
  />
);

/* ══════════════════════════════════════════════════════════
   MAIN CITY HERO IMAGE COMPONENT (Offline gradients + particles)
   ══════════════════════════════════════════════════════════ */
const CityHeroImage = ({ city, country, condition, isNight, className = '' }) => {
  const overlay = getWeatherOverlay(condition, isNight);

  // Fallback gradient when no image available
  const fallbackGradient = isNight
    ? 'from-slate-950 via-indigo-950 to-slate-900'
    : condition?.toLowerCase().includes('rain')
      ? 'from-slate-900 via-blue-950 to-slate-800'
      : condition?.toLowerCase().includes('clear')
        ? 'from-slate-900 via-orange-950 to-slate-800'
        : 'from-slate-900 via-slate-800 to-slate-700';

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>

      {/* ── Dynamic static gradient backdrop ── */}
      <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient} transition-all duration-1000`} />

      {/* ── Weather-specific atmospheric tint ── */}
      <div className={`absolute inset-0 ${overlay.tint} transition-all duration-1000 pointer-events-none`} />

      {/* ── Main darkening gradient (ensures text readability) ── */}
      <div className={`absolute inset-0 ${overlay.gradient} pointer-events-none`} />

      {/* ── Weather Particles / Atmosphere ── */}
      {overlay.particles === 'rain'      && <RainParticles />}
      {overlay.particles === 'snow'      && <SnowParticles />}
      {overlay.particles === 'stars'     && <StarParticles />}
      {overlay.particles === 'sun'       && <SunBloom />}
      {overlay.particles === 'fog'       && <FogOverlay />}

      {/* ── Noise texture for cinematic grain ── */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-15 mix-blend-overlay pointer-events-none" />
    </div>
  );
};

export default CityHeroImage;
