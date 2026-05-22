import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import { getAQIStatus } from '../utils/aqiUtils';

/* ─────────────────────────────────────────────────────────────────
   PREMIUM CUSTOM SVG WEATHER ICONS
   Clean outline style · 2px stroke · futuristic atmospheric glyphs
───────────────────────────────────────────────────────────────── */

const IconCloudMoon = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
    {/* Moon crescent */}
    <path d="M44 12C44 18.627 38.627 24 32 24C28.686 24 25.686 22.657 23.515 20.485C24.828 25.943 29.741 30 35.5 30C42.404 30 48 24.404 48 17.5C48 15.577 47.546 13.758 46.74 12.143C45.852 12.048 44.934 12 44 12Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.12" />
    <path d="M23.515 20.485C22.553 19.522 21.726 18.427 21.062 17.231C17.95 17.793 15.175 19.527 13.293 21.999" stroke="currentColor" strokeWidth="2" />
    {/* Main cloud body */}
    <path d="M13 37C9.134 37 6 33.866 6 30C6 26.686 8.343 23.914 11.491 23.171C11.17 22.154 11 21.075 11 20C11 14.477 15.477 10 21 10C24.139 10 26.938 11.428 28.824 13.684C29.529 13.243 30.282 12.875 31.077 12.592" stroke="currentColor" strokeWidth="2" />
    <path d="M13 37H43C47.418 37 51 33.418 51 29C51 24.582 47.418 21 43 21C42.393 21 41.8 21.066 41.228 21.192C39.836 17.01 35.872 14 31.167 14C28.625 14 26.29 14.913 24.479 16.424" stroke="currentColor" strokeWidth="2" />
    <path d="M8 37H43C47.418 37 51 33.418 51 29C51 24.582 47.418 21 43 21" stroke="currentColor" strokeWidth="2.2" fill="none" />
    {/* Cloud fill */}
    <path d="M11 30C11 26.134 14.134 23 18 23C19.374 23 20.653 23.413 21.724 24.124C22.897 20.567 26.219 18 30.167 18C35.136 18 39.167 22.03 39.167 27C39.167 27.34 39.145 27.675 39.104 28.004C39.388 27.957 39.682 27.933 39.982 27.933C42.75 27.933 45 30.183 45 32.952C45 35.72 42.75 37.97 39.982 37.97H12C9.239 37.97 7 35.732 7 32.97C7 30.209 9.239 27.97 12 27.97" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconWindFlow = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
    {/* Wind lines – varied lengths for depth */}
    <path d="M6 20C6 20 16 20 28 20C34 20 38 16 34 12C30 8 24 12 26 16" stroke="currentColor" strokeWidth="2.2" />
    <path d="M6 29H46C52 29 56 25 52 21C48 17 42 20 44 24" stroke="currentColor" strokeWidth="2.2" />
    <path d="M6 38H38" stroke="currentColor" strokeWidth="2.2" />
    <path d="M6 47H30C36 47 40 51 36 55C32 59 26 55 28 51" stroke="currentColor" strokeWidth="2.2" />
    {/* Motion arc */}
    <path d="M50 38C53 38 56 36 56 33C56 30 53 28 50 28" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
  </svg>
);

const IconRainCloud = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
    {/* Cloud */}
    <path d="M16 28C16 22.477 20.477 18 26 18C29.139 18 31.938 19.428 33.824 21.684C35.124 20.622 36.787 20 38.6 20C42.716 20 46.066 23.134 46.066 27C46.066 27.2 46.055 27.397 46.032 27.591C47.867 28.476 49.133 30.361 49.133 32.555C49.133 35.556 46.714 38 43.742 38H16C12.686 38 10 35.314 10 32C10 28.686 12.686 26 16 26" stroke="currentColor" strokeWidth="2.2" />
    {/* Rain drops - staggered */}
    <path d="M20 44L18 52" stroke="currentColor" strokeWidth="2.2" />
    <path d="M28 46L26 54" stroke="currentColor" strokeWidth="2.2" />
    <path d="M36 44L34 52" stroke="currentColor" strokeWidth="2.2" />
    <path d="M44 46L42 54" stroke="currentColor" strokeWidth="2.2" />
    {/* Drop tips */}
    <circle cx="18" cy="52.5" r="1.5" fill="currentColor" />
    <circle cx="26" cy="54.5" r="1.5" fill="currentColor" />
    <circle cx="34" cy="52.5" r="1.5" fill="currentColor" />
    <circle cx="42" cy="54.5" r="1.5" fill="currentColor" />
  </svg>
);

const IconThunderstorm = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
    {/* Cloud */}
    <path d="M14 30C14 24.477 18.477 20 24 20C27.139 20 29.938 21.428 31.824 23.684C33.124 22.622 34.787 22 36.6 22C40.716 22 44.066 25.134 44.066 29C44.066 29.2 44.055 29.397 44.032 29.591C45.867 30.476 47.133 32.361 47.133 34.555C47.133 37.556 44.714 40 41.742 40H14C10.686 40 8 37.314 8 34C8 30.686 10.686 28 14 28" stroke="currentColor" strokeWidth="2.2" />
    {/* Lightning bolt */}
    <path d="M36 40L26 52H34L24 64" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Side lightning flare */}
    <path d="M42 40L38 47H43L39 54" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    {/* Glow dot at bolt tip */}
    <circle cx="24" cy="64" r="1.8" fill="currentColor" />
  </svg>
);

const IconSnow = ({ className }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round">
    {/* Cloud top */}
    <path d="M14 30C14 24.477 18.477 20 24 20C27.139 20 29.938 21.428 31.824 23.684C33.124 22.622 34.787 22 36.6 22C40.716 22 44.066 25.134 44.066 29C44.066 29.2 44.055 29.397 44.032 29.591C45.867 30.476 47.133 32.361 47.133 34.555C47.133 37.556 44.714 40 41.742 40H14C10.686 40 8 37.314 8 34C8 30.686 10.686 28 14 28" stroke="currentColor" strokeWidth="2.2" />
    {/* Snowflake 1 - center */}
    <line x1="28" y1="47" x2="28" y2="59" stroke="currentColor" strokeWidth="2" />
    <line x1="22" y1="50" x2="34" y2="56" stroke="currentColor" strokeWidth="2" />
    <line x1="34" y1="50" x2="22" y2="56" stroke="currentColor" strokeWidth="2" />
    {/* Snowflake 1 arms */}
    <line x1="28" y1="47" x2="25" y2="50" stroke="currentColor" strokeWidth="1.5" />
    <line x1="28" y1="47" x2="31" y2="50" stroke="currentColor" strokeWidth="1.5" />
    <line x1="28" y1="59" x2="25" y2="56" stroke="currentColor" strokeWidth="1.5" />
    <line x1="28" y1="59" x2="31" y2="56" stroke="currentColor" strokeWidth="1.5" />
    {/* Snowflake 2 - left small */}
    <line x1="16" y1="44" x2="16" y2="52" stroke="currentColor" strokeWidth="1.6" />
    <line x1="12" y1="46" x2="20" y2="50" stroke="currentColor" strokeWidth="1.6" />
    <line x1="20" y1="46" x2="12" y2="50" stroke="currentColor" strokeWidth="1.6" />
    {/* Snowflake 3 - right small */}
    <line x1="42" y1="44" x2="42" y2="52" stroke="currentColor" strokeWidth="1.6" />
    <line x1="38" y1="46" x2="46" y2="50" stroke="currentColor" strokeWidth="1.6" />
    <line x1="46" y1="46" x2="38" y2="50" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────
   COMPONENT CONFIG MAP
───────────────────────────────────────────────────────────────── */
const ICONS = {
  cloudMoon: IconCloudMoon,
  windFlow: IconWindFlow,
  rainCloud: IconRainCloud,
  thunderstorm: IconThunderstorm,
  snow: IconSnow,
};

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
const FloatingTelemetry = () => {
  const { weather, airQuality } = useWeather();
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handle = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('mousemove', handle, { passive: true });
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  /* Live telemetry values */
  const clouds      = weather?.clouds?.all   ?? 52;
  const windSpeed   = weather?.wind?.speed   ?? 5.2;
  const humidity    = weather?.main?.humidity ?? 70;
  const visibility  = weather?.visibility ? Math.round(weather.visibility / 1000) : 10;
  const aqiVal      = airQuality?.list?.[0]?.main?.aqi ?? 1;
  const components  = airQuality?.list?.[0]?.components ?? null;
  const aqiStatus   = getAQIStatus(aqiVal, components);
  const aqiScore    = aqiStatus?.value ?? 25;

  /* The 5 hero-center nodes — exact layout matching reference */
  const nodes = [
    {
      id: 'cloudMoon',
      label: 'CLOUD COVER',
      value: `${clouds}%`,
      color: 'cyan',
      /* Top-center */
      style: {
        top: '6%',
        left: '50%',
        transform: 'translateX(-50%)',
      },
      pxMult: { x: 8,   y: 12  },
      floatDuration: 7,
      delay: 0,
      glowColor: 'rgba(34,211,238,0.55)',
      borderColor: 'rgba(34,211,238,0.55)',
      bgColor: 'rgba(8,47,73,0.55)',
    },
    {
      id: 'windFlow',
      label: 'WIND FLOW',
      value: `${Math.round(windSpeed)} m/s`,
      color: 'sky',
      /* Upper-right center */
      style: {
        top: '22%',
        right: '6%',
      },
      pxMult: { x: -18, y: -12 },
      floatDuration: 9,
      delay: 1.2,
      glowColor: 'rgba(56,189,248,0.50)',
      borderColor: 'rgba(56,189,248,0.55)',
      bgColor: 'rgba(7,45,85,0.55)',
    },
    {
      id: 'rainCloud',
      label: 'HUMIDITY',
      value: `${humidity}%`,
      color: 'blue',
      /* Dead center — slightly right */
      style: {
        top: '45%',
        left: '52%',
        transform: 'translateY(-50%)',
      },
      pxMult: { x: 14,  y: 18  },
      floatDuration: 8,
      delay: 0.6,
      glowColor: 'rgba(96,165,250,0.55)',
      borderColor: 'rgba(96,165,250,0.55)',
      bgColor: 'rgba(10,30,80,0.55)',
    },
    {
      id: 'thunderstorm',
      label: 'AQI LEVEL',
      value: `${aqiScore}`,
      color: 'violet',
      /* Lower-left center */
      style: {
        bottom: '22%',
        left: '5%',
      },
      pxMult: { x: -14, y: 20  },
      floatDuration: 10,
      delay: 1.8,
      glowColor: 'rgba(167,139,250,0.55)',
      borderColor: 'rgba(167,139,250,0.55)',
      bgColor: 'rgba(30,10,80,0.55)',
    },
    {
      id: 'snow',
      label: 'VISIBILITY',
      value: `${visibility} km`,
      color: 'indigo',
      /* Lower-right center */
      style: {
        bottom: '12%',
        right: '5%',
      },
      pxMult: { x: 20,  y: -14 },
      floatDuration: 7.5,
      delay: 2.4,
      glowColor: 'rgba(129,140,248,0.55)',
      borderColor: 'rgba(129,140,248,0.55)',
      bgColor: 'rgba(15,15,90,0.55)',
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-10 overflow-hidden pointer-events-none select-none"
    >
      {nodes.map((node, i) => {
        const SvgIcon = ICONS[node.id];
        const px = mousePos.x * node.pxMult.x;
        const py = mousePos.y * node.pxMult.y;

        return (
          <motion.div
            key={node.id}
            className="absolute pointer-events-auto"
            style={node.style}
            /* Parallax spring */
            animate={{ x: px, y: py }}
            transition={{ type: 'spring', stiffness: 38, damping: 22 }}
          >
            {/* Breathing float wrapper */}
            <motion.div
              animate={{
                y: [0, -14, 0],
                opacity: [0.82, 1, 0.82],
              }}
              transition={{
                y: {
                  duration: node.floatDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: node.delay,
                },
                opacity: {
                  duration: node.floatDuration * 0.9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: node.delay,
                },
              }}
              className="flex flex-col items-center gap-2"
            >
              {/* ── HUD CONTAINER ── */}
              <div
                className="relative flex flex-col items-center group cursor-default"
              >
                {/* Outermost soft bloom */}
                <div
                  className="absolute -inset-5 rounded-full blur-xl"
                  style={{ background: node.glowColor, opacity: 0.25 }}
                />

                {/* Outer dashed orbit ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-4 rounded-full"
                  style={{
                    border: `1px dashed ${node.borderColor}`,
                    opacity: 0.35,
                  }}
                />

                {/* Outer solid ring */}
                <div
                  className="absolute -inset-2 rounded-full"
                  style={{
                    border: `1px solid ${node.borderColor}`,
                    opacity: 0.45,
                    boxShadow: `0 0 16px ${node.glowColor}`,
                  }}
                />

                {/* Main glass disk */}
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center backdrop-blur-md z-10 transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: node.bgColor,
                    border: `1.5px solid ${node.borderColor}`,
                    boxShadow: `0 0 28px ${node.glowColor}, inset 0 0 16px rgba(255,255,255,0.04)`,
                  }}
                >
                  {/* Inner slow-spin calibration ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-1 rounded-full"
                    style={{
                      border: `1px dashed ${node.borderColor}`,
                      opacity: 0.3,
                    }}
                  />

                  {/* Scan-line sweep */}
                  <motion.div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    aria-hidden="true"
                  >
                    <motion.div
                      animate={{ y: ['-100%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: node.delay }}
                      className="w-full h-1/3"
                      style={{
                        background: `linear-gradient(to bottom, transparent, ${node.glowColor}, transparent)`,
                        opacity: 0.4,
                      }}
                    />
                  </motion.div>

                  {/* THE WEATHER ICON — large, bright, premium */}
                  <SvgIcon
                    className="w-10 h-10 relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      color: node.glowColor.replace('0.55', '0.95'),
                      filter: `drop-shadow(0 0 10px ${node.glowColor}) drop-shadow(0 0 4px ${node.glowColor})`,
                      stroke: node.borderColor.replace('0.55', '0.9'),
                    }}
                  />
                </div>

                {/* Vertical dotted connector trail */}
                <div className="relative flex flex-col items-center mt-1.5" style={{ height: 32 }}>
                  <motion.div
                    animate={{ opacity: [0, 1, 0], y: [0, 28, 28] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: node.delay }}
                    className="absolute top-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: node.borderColor, boxShadow: `0 0 6px ${node.glowColor}` }}
                  />
                  <div
                    className="w-px"
                    style={{
                      height: '100%',
                      background: `linear-gradient(to bottom, ${node.borderColor}, transparent)`,
                      opacity: 0.55,
                    }}
                  />
                </div>

                {/* Telemetry readout */}
                <div className="flex flex-col items-center text-center mt-0 pointer-events-none"
                  style={{ minWidth: 72 }}>
                  <span
                    className="text-[9px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 group-hover:opacity-100"
                    style={{ color: node.borderColor, opacity: 0.75 }}
                  >
                    {node.label}
                  </span>
                  <span
                    className="text-[13px] font-black tracking-widest mt-0.5 text-white transition-colors duration-300 group-hover:text-white"
                    style={{
                      textShadow: `0 0 8px ${node.glowColor}`,
                      letterSpacing: '0.12em',
                    }}
                  >
                    {node.value}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingTelemetry;
