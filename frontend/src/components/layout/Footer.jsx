import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Activity,
  Code,
  Shield,
  FileText,
  CloudLightning,
  GitBranch,
  X,
  CheckCircle2,
  Server,
  Database,
  Cpu,
  Layers,
  Terminal,
  ArrowRight,
  ExternalLink,
  Mail,
  Globe,
  RefreshCw,
  AlertTriangle,
  Heart,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { weather } = useWeather();
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | 'status' | 'docs' | null
  const [docsTab, setDocsTab] = useState('stack'); // 'stack' | 'api' | 'ai' | 'ui'
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  // Trigger simulated status refresh
  const handleRefreshStatus = () => {
    setRefreshingStatus(true);
    setTimeout(() => setRefreshingStatus(false), 800);
  };

  // Open Docs directly to a specific section
  const openDocsAt = (tab) => {
    setDocsTab(tab);
    setActiveModal('docs');
  };

  return (
    <footer className="relative mt-auto w-full z-50 overflow-hidden bg-white/85 border-t border-[#C5A880]/25 backdrop-blur-xl shadow-sm">
      
      {/* Top Brushed Gold Hairline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/70 to-transparent"></div>

      {/* Subtle Warm Champagne Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-36 bg-gradient-to-t from-[#DFCCA6]/15 via-[#C5A880]/5 to-transparent blur-[100px] pointer-events-none rounded-t-full"></div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        
        {/* Upper Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Narrative (Covers 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#FAF8F5] border border-[#C5A880]/40 flex items-center justify-center shadow-sm">
                <img 
                  src="/logo.png" 
                  alt="AtmosIQ Logo" 
                  className="w-full h-full object-contain p-0.5 scale-110 transition-transform duration-700 group-hover:scale-120 group-hover:rotate-6" 
                />
              </div>
              <span className="text-2xl font-editorial font-bold tracking-tight text-[#1C1917]">
                Atmos<span className="font-roman text-[#B89758] ml-0.5">IQ</span>
              </span>
            </div>
            
            <p className="text-[#57493A] text-sm font-medium leading-relaxed max-w-sm">
              Next-generation spatial climate intelligence atelier, delivering high-precision environmental telemetry, living 3D atmospheric simulations, and conversational advisory analytics.
            </p>

            {/* Live Telemetry Pulse Line */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 border border-[#C5A880]/30 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className="text-[10px] font-roman tracking-widest text-[#6B5E51] uppercase flex items-center gap-1.5">
                AtmosIQ Spatial Gateway Online <span className="opacity-40">•</span> Global Telemetry Active
              </span>
            </div>
          </div>

          {/* Column 2: Climate Intelligence */}
          <div className="space-y-4">
            <h3 className="text-xs font-roman text-[#1C1917] uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-[#B89758]" />
              Climate Intelligence
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/health" className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  AQI Monitoring
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  Weather Analytics
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  AI Forecasting
                </Link>
              </li>
              <li>
                <Link to="/travel" className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  Travel Intelligence
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-4">
            <h3 className="text-xs font-roman text-[#1C1917] uppercase tracking-widest flex items-center gap-2">
              <Bot className="w-3.5 h-3.5 text-[#B89758]" />
              Platform
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link to="/assistant" className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  Visual Analysis
                </Link>
              </li>
              <li>
                <Link to="/radar" className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  Geospatial Radar
                </Link>
              </li>
              <li>
                <Link to="/" className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  Spatial Atmosphere
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Developer */}
          <div className="space-y-4">
            <h3 className="text-xs font-roman text-[#1C1917] uppercase tracking-widest flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-[#B89758]" />
              Developer
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <button onClick={() => openDocsAt('api')} className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  API Documentation
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('status')} className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  System Architecture
                </button>
              </li>
              <li>
                <button onClick={() => openDocsAt('stack')} className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  Engine Specifications
                </button>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#57493A] hover:text-[#B89758] transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-[#C5A880] group-hover:translate-x-0.5 transition-transform" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Row Divider Line */}
        <div className="w-full h-px bg-[#C5A880]/20 mb-8"></div>

        {/* Bottom Section: Telemetry Info, Modals, Copyrights, & Socials */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Metadata Telemetry Label */}
          <div className="text-xs font-roman text-[#786E65] bg-[#FAF8F5] border border-[#C5A880]/30 px-4.5 py-2 rounded-full shadow-sm tracking-wider">
            ATELIER ED. · NODE: {weather?.name || 'GENEVA'} · 3D SPATIAL ENGINE ACTIVE
          </div>

          {/* Social Icons & External Links */}
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com" target="_blank" rel="noopener noreferrer" 
              className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/30 flex items-center justify-center text-[#57493A] hover:text-[#1C1917] hover:border-[#B89758] hover:shadow-sm transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/30 flex items-center justify-center text-[#57493A] hover:text-[#1C1917] hover:border-[#B89758] hover:shadow-sm transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a 
              href="mailto:support@atmosiq.io"
              className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/30 flex items-center justify-center text-[#57493A] hover:text-[#1C1917] hover:border-[#B89758] hover:shadow-sm transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a 
              href="https://unsplash.com" target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/30 flex items-center justify-center text-[#57493A] hover:text-[#1C1917] hover:border-[#B89758] hover:shadow-sm transition-all"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>

          {/* Privacy & Legal Anchors */}
          <div className="flex items-center gap-6 text-xs font-semibold text-[#6B5E51]">
            <button 
              onClick={() => setActiveModal('privacy')} 
              className="hover:text-[#B89758] transition-colors cursor-pointer"
            >
              Privacy Standards
            </button>
            <span className="opacity-30 text-[#C5A880]">|</span>
            <button 
              onClick={() => setActiveModal('terms')} 
              className="hover:text-[#B89758] transition-colors cursor-pointer"
            >
              Terms of Protocol
            </button>
          </div>

        </div>

        {/* Small copyright disclaimer at the bottom */}
        <div className="text-center text-[10px] font-roman text-[#A89D8F] mt-10 tracking-[0.25em] uppercase">
          © {new Date().getFullYear()} AtmosIQ Spatial Climate Systems. Precision Horological & Meteorological Architecture.
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════
          INTERACTIVE PLATFORM MODALS (Framer Motion)
          ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            
            {/* Modal Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-[#1C1917]/70 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto luxury-panel rounded-[2.5rem] border border-[#C5A880]/40 p-6 md:p-10 shadow-[0_30px_80px_rgba(28,25,23,0.35)] bg-[#FAF8F5]/95 z-10 text-[#1C1917]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full hover:bg-[#EDE6DA] text-[#786C62] hover:text-[#1C1917] transition-colors cursor-pointer z-20 border border-[#C5A880]/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 🔒 PRIVACY MODAL CONTENT */}
              {activeModal === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3.5 mb-2 border-b border-[#C5A880]/20 pb-4">
                    <div className="p-2.5 bg-[#F5EFEB] rounded-xl border border-[#C5A880]/40 text-[#8C6D3B]">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif font-light text-[#1C1917]">Telemetry & Data Governance</h2>
                      <p className="text-[10px] text-[#8C6D3B] font-roman uppercase tracking-[0.2em] mt-0.5 font-semibold">Sovereign Climate Analytics Protocols</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#2A2421] leading-relaxed font-sans">
                    AtmosIQ enforces uncompromising security standards. We operate with strict query isolation and cryptographically verified telemetry transmission to maintain total confidentiality across your geographical queries and atmospheric consultations.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-5 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/25 shadow-sm">
                      <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] flex items-center gap-2 mb-2 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-[#657953]" />
                        End-to-End Encryption
                      </h4>
                      <p className="text-xs text-[#786C62] leading-relaxed font-sans">
                        All telemetry transactions, device state configurations, and live meteorological feeds are authenticated via TLS 1.3 and encrypted at rest with AES-256 standards.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/25 shadow-sm">
                      <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] flex items-center gap-2 mb-2 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-[#657953]" />
                        Zero Persistent Tracking
                      </h4>
                      <p className="text-xs text-[#786C62] leading-relaxed font-sans">
                        Coordinate lookups are evaluated strictly in-memory to synthesize microclimate readings. AtmosIQ does not maintain persistent location surveillance or profile archives.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/25 shadow-sm">
                      <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] flex items-center gap-2 mb-2 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-[#657953]" />
                        Anonymized Intelligence Core
                      </h4>
                      <p className="text-xs text-[#786C62] leading-relaxed font-sans">
                        Consultations processed through our multi-tier AI inference cascade are stripped of client signatures, executing with ephemeral privacy guarantees.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/25 shadow-sm">
                      <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] flex items-center gap-2 mb-2 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-[#657953]" />
                        Shielded API Gateways
                      </h4>
                      <p className="text-xs text-[#786C62] leading-relaxed font-sans">
                        All atmospheric and radar satellite feeds are brokered through dedicated proxies, ensuring your origin IP is never exposed to upstream meteorological registries.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/30 text-xs text-[#8C6D3B] leading-relaxed font-sans flex gap-3 mt-4 shadow-sm">
                    <Shield className="w-5 h-5 text-[#8C6D3B] shrink-0 mt-0.5" />
                    <span>
                      <strong>Compliance Standards:</strong> AtmosIQ adheres to strict GDPR and CCPA privacy frameworks. We operate with an uncompromising zero-ad-tracker mandate.
                    </span>
                  </div>
                </div>
              )}

              {/* ⚖️ TERMS MODAL CONTENT */}
              {activeModal === 'terms' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3.5 mb-2 border-b border-[#C5A880]/20 pb-4">
                    <div className="p-2.5 bg-[#F5EFEB] rounded-xl border border-[#C5A880]/40 text-[#8C6D3B]">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif font-light text-[#1C1917]">Terms of Operation</h2>
                      <p className="text-[10px] text-[#8C6D3B] font-roman uppercase tracking-[0.2em] mt-0.5 font-semibold">Atmospheric Intelligence Charter</p>
                    </div>
                  </div>

                  <p className="text-sm text-[#2A2421] leading-relaxed font-sans">
                    By initializing or consulting AtmosIQ Climate Intelligence systems, you explicitly acknowledge the operational standards and advisory parameters outlined below.
                  </p>

                  <div className="space-y-4 mt-6">
                    <div className="flex gap-4 p-4 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/20">
                      <div className="w-7 h-7 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/40 flex items-center justify-center shrink-0 font-roman font-semibold text-xs text-[#8C6D3B]">I</div>
                      <div>
                        <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] mb-1 font-semibold">Autonomous Climate Intelligence Advisory</h4>
                        <p className="text-xs text-[#786C62] leading-relaxed font-sans">
                          Atmospheric assessments and conversational advisories formulated by the multi-tier AI inference cascade are intended for precision intelligence and tactical planning. They must not supersede official civil defense alerts or meteorological emergency orders.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/20">
                      <div className="w-7 h-7 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/40 flex items-center justify-center shrink-0 font-roman font-semibold text-xs text-[#8C6D3B]">II</div>
                      <div>
                        <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] mb-1 font-semibold">Sensor Resolution & Microclimatic Variance</h4>
                        <p className="text-xs text-[#786C62] leading-relaxed font-sans">
                          Atmospheric data points, particulate readings, and solar radiation indices are synthesized from sovereign radar constellations. Localized topographical anomalies and microclimates may induce minor deviations from calibrated models.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/20">
                      <div className="w-7 h-7 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/40 flex items-center justify-center shrink-0 font-roman font-semibold text-xs text-[#8C6D3B]">III</div>
                      <div>
                        <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] mb-1 font-semibold">Cartography & 3D Spatial Rendering</h4>
                        <p className="text-xs text-[#786C62] leading-relaxed font-sans">
                          Interactive 3D celestial globes, horological compass complications, and route visualizers are computed in real-time via hardware-accelerated WebGL environments.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/20">
                      <div className="w-7 h-7 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/40 flex items-center justify-center shrink-0 font-roman font-semibold text-xs text-[#8C6D3B]">IV</div>
                      <div>
                        <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] mb-1 font-semibold">Tiered Request Governance</h4>
                        <p className="text-xs text-[#786C62] leading-relaxed font-sans">
                          Public access is allocated at 100 authenticated queries per hour. Automated scraping or malicious traffic patterns are neutralized at the reverse proxy boundary.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 📊 SYSTEM STATUS MODAL CONTENT */}
              {activeModal === 'status' && (
                <div className="space-y-6">
                  
                  {/* Title Header */}
                  <div className="flex items-center justify-between border-b border-[#C5A880]/20 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 bg-[#F5EFEB] rounded-xl border border-[#C5A880]/40 text-[#8C6D3B]">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-serif font-light text-[#1C1917]">System Operations Status</h2>
                        <p className="text-[10px] text-[#8C6D3B] font-roman uppercase tracking-[0.2em] mt-0.5 font-semibold">Meteorological & AI Infrastructure Health</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleRefreshStatus}
                      className={`p-2.5 rounded-xl border border-[#C5A880]/30 hover:border-[#C5A880] text-[#786C62] hover:text-[#1C1917] bg-[#FAF8F5] transition-all flex items-center gap-1.5 text-xs font-roman uppercase tracking-wider cursor-pointer shadow-sm ${refreshingStatus ? 'opacity-50' : ''}`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${refreshingStatus ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>

                  {/* Summary telemetry cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-5 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/25 text-center flex flex-col justify-center shadow-sm">
                      <span className="text-[9px] font-roman text-[#786C62] uppercase tracking-[0.2em] mb-1.5 font-semibold">Overall System Status</span>
                      <span className="text-2xl font-serif text-[#657953] flex items-center justify-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#657953] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#657953]"></span>
                        </span>
                        Operational
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/25 text-center flex flex-col justify-center shadow-sm">
                      <span className="text-[9px] font-roman text-[#786C62] uppercase tracking-[0.2em] mb-1.5 font-semibold">Average Uptime</span>
                      <span className="text-2xl font-serif text-[#1C1917]">99.98%</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/25 text-center flex flex-col justify-center shadow-sm">
                      <span className="text-[9px] font-roman text-[#786C62] uppercase tracking-[0.2em] mb-1.5 font-semibold">AI Gateway Latency</span>
                      <span className="text-2xl font-serif text-[#8C6D3B] flex items-center justify-center gap-1.5">
                        <Cpu className="w-5 h-5 text-[#8C6D3B]" />
                        142ms
                      </span>
                    </div>
                  </div>

                  {/* Operational indicators list */}
                  <div className="space-y-3 mt-8">
                    <h3 className="text-xs font-roman uppercase tracking-[0.2em] text-[#1C1917] font-semibold mb-3 border-l-2 border-[#8C6D3B] pl-2.5">Core Infrastructure Nodes</h3>
                    
                    {[
                      { icon: <Server className="w-4 h-4 text-[#8C6D3B]" />, name: "Weather API Gateway", desc: "OpenWeatherMap Global Constellation", status: "Operational • 99.98%" },
                      { icon: <Compass className="w-4 h-4 text-[#8C6D3B]" />, name: "Particulate Sensor Array", desc: "PM2.5 / PM10 Telemetry Stream", status: "Operational • 100.00%" },
                      { icon: <Bot className="w-4 h-4 text-[#8C6D3B]" />, name: "AI Gateway Cascade Router", desc: "Multi-Tier LLM Intelligence Node", status: "Operational • 99.92%" },
                      { icon: <Globe className="w-4 h-4 text-[#8C6D3B]" />, name: "3D Spatial Render Pipeline", desc: "Hardware-Accelerated WebGL Engine", status: "Operational • 100.00%" },
                      { icon: <Database className="w-4 h-4 text-[#8C6D3B]" />, name: "Secure Storage Cluster", desc: "Persistent Configuration Registry", status: "Operational • 100.00%" },
                      { icon: <Cpu className="w-4 h-4 text-[#8C6D3B]" />, name: "Synthesizer & Dispatch Node", desc: "Heuristic Climate Safety Cascade", status: "Operational • Optimal" },
                    ].map((node, nIdx) => (
                      <div key={nIdx} className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] border border-[#C5A880]/20 hover:border-[#C5A880]/50 transition-colors shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#F5EFEB] flex items-center justify-center border border-[#C5A880]/30">
                            {node.icon}
                          </div>
                          <div>
                            <p className="text-xs font-roman uppercase tracking-wider text-[#1C1917] font-semibold">{node.name}</p>
                            <p className="text-[10px] text-[#786C62] font-sans mt-0.5">{node.desc}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-sans font-medium text-[#657953] px-3 py-1 rounded-full bg-[#657953]/10 border border-[#657953]/25">
                          {node.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 📖 DOCUMENTATION PORTAL CONTENT */}
              {activeModal === 'docs' && (
                <div className="space-y-6">
                  
                  {/* Header Title */}
                  <div className="flex items-center gap-3.5 mb-2 border-b border-[#C5A880]/20 pb-4">
                    <div className="p-2.5 bg-[#F5EFEB] rounded-xl border border-[#C5A880]/40 text-[#8C6D3B]">
                      <Code className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-serif font-light text-[#1C1917]">Developer Atelier</h2>
                      <p className="text-[10px] text-[#8C6D3B] font-roman uppercase tracking-[0.2em] mt-0.5 font-semibold">Architecture, Secure APIs & Spatial Engine</p>
                    </div>
                  </div>

                  {/* Double Row Tab Interface */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-[#C5A880]/20 pb-4">
                    {[
                      { id: 'stack', label: 'Architecture & Stack' },
                      { id: 'api', label: 'Secure Gateways' },
                      { id: 'ai', label: 'AI Inference Cascade' },
                      { id: 'ui', label: '3D Spatial System' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setDocsTab(tab.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-roman uppercase tracking-wider transition-all cursor-pointer font-semibold ${docsTab === tab.id ? 'bg-[#C5A880] text-[#FAF8F5] shadow-sm' : 'bg-[#F5EFEB] text-[#786C62] hover:text-[#1C1917] border border-[#C5A880]/20'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Content based on Tab */}
                  <div className="mt-6 space-y-6">
                    
                    {/* TAB: STACK */}
                    {docsTab === 'stack' && (
                      <div className="space-y-4">
                        <h3 className="text-base font-roman uppercase tracking-wider text-[#1C1917] flex items-center gap-2 font-semibold">
                          <Cpu className="w-4 h-4 text-[#8C6D3B]" />
                          Technology Stack
                        </h3>
                        <p className="text-sm text-[#786C62] leading-relaxed font-sans">
                          AtmosIQ is engineered with decoupled microservices uniting a high-performance React-Vite client with an armored Node.js backend.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="p-5 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/25 shadow-sm space-y-3">
                            <span className="text-[10px] font-roman uppercase tracking-[0.2em] text-[#8C6D3B] block font-semibold">Client-Side Presentation</span>
                            <ul className="space-y-2 text-xs font-sans text-[#2A2421]">
                              <li>• <strong>React 19 + Vite:</strong> Ultra-fast modern virtual DOM hydration</li>
                              <li>• <strong>Three.js WebGL:</strong> Custom interactive 3D celestial globes and horological complications</li>
                              <li>• <strong>Framer Motion:</strong> Kinetic layout choreography and fluidity</li>
                              <li>• <strong>TailwindCSS:</strong> Bespoke luxury design tokenization</li>
                            </ul>
                          </div>

                          <div className="p-5 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/25 shadow-sm space-y-3">
                            <span className="text-[10px] font-roman uppercase tracking-[0.2em] text-[#8C6D3B] block font-semibold">Server & Security Core</span>
                            <ul className="space-y-2 text-xs font-sans text-[#2A2421]">
                              <li>• <strong>Express Engine:</strong> Production-hardened RESTful telemetry dispatch</li>
                              <li>• <strong>Helmet Defense:</strong> Strict CSP and origin protection headers</li>
                              <li>• <strong>MongoDB Atlas:</strong> Persistent journal and route repository</li>
                              <li>• <strong>Pino Telemetry:</strong> Structured millisecond event logger</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: API */}
                    {docsTab === 'api' && (
                      <div className="space-y-4">
                        <h3 className="text-base font-roman uppercase tracking-wider text-[#1C1917] flex items-center gap-2 font-semibold">
                          <Terminal className="w-4 h-4 text-[#8C6D3B]" />
                          Secure API Endpoints
                        </h3>
                        <p className="text-sm text-[#786C62] leading-relaxed font-sans">
                          All third-party credentials reside exclusively within the backend proxy layer. Client applications interact via cryptographically secure endpoints:
                        </p>

                        <div className="p-5 rounded-2xl bg-[#F5EFEB]/70 border border-[#C5A880]/25 space-y-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-[#C5A880]/20 text-[#8C6D3B] border border-[#C5A880]/40 rounded-xl text-[10px] font-roman font-semibold uppercase tracking-widest">POST</span>
                            <span className="text-xs font-mono font-bold text-[#1C1917]">/api/v1/ai/chat</span>
                          </div>
                          <p className="text-xs text-[#786C62] font-sans">
                            Dispatches conversational prompts to the Gemini intelligence cascade with client meteorological context parameters.
                          </p>
                          <div className="bg-[#FAF8F5] border border-[#C5A880]/20 rounded-xl p-3.5 font-mono text-xs text-[#2A2421] overflow-x-auto">
                            <p className="text-[#8C6D3B] mb-1.5">// Payload: message, weatherContext</p>
                            {`curl -X POST "https://atmosiq-18gz.onrender.com/api/v1/ai/chat" \\
  -H "Content-Type: application/json" \\
  -d '{ "message": "Evaluate exterior conditions today", "weatherContext": { "temp": 24, "condition": "Clear" } }'`}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: AI MODEL CASCADE */}
                    {docsTab === 'ai' && (
                      <div className="space-y-4">
                        <h3 className="text-base font-roman uppercase tracking-wider text-[#1C1917] flex items-center gap-2 font-semibold">
                          <Bot className="w-4 h-4 text-[#8C6D3B]" />
                          Multi-Tier Intelligence Cascade
                        </h3>
                        <p className="text-sm text-[#786C62] leading-relaxed font-sans">
                          AtmosIQ utilizes fail-safe tier degradation to ensure zero-downtime conversational assistance across all geographical conditions:
                        </p>

                        <div className="space-y-3 mt-4">
                          <div className="p-4 rounded-xl bg-[#F5EFEB]/70 border border-[#C5A880]/20">
                            <span className="text-[10px] font-roman uppercase tracking-widest text-[#8C6D3B] font-semibold block mb-1">Tier 1: Primary Intelligence</span>
                            <h4 className="text-xs font-semibold text-[#1C1917] mb-1">gemini-2.0-flash</h4>
                            <p className="text-xs text-[#786C62] font-sans">High-speed reasoning model tailored for instantaneous conversational meteorological advisories.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F5EFEB]/70 border border-[#C5A880]/20">
                            <span className="text-[10px] font-roman uppercase tracking-widest text-[#8C6D3B] font-semibold block mb-1">Tier 2: Resilient Secondary</span>
                            <h4 className="text-xs font-semibold text-[#1C1917] mb-1">gemini-1.5-flash / gemini-1.5-pro</h4>
                            <p className="text-xs text-[#786C62] font-sans">Automatic failover destination upon transient API quota or latency anomalies.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F5EFEB]/70 border border-[#C5A880]/20">
                            <span className="text-[10px] font-roman uppercase tracking-widest text-[#8C6D3B] font-semibold block mb-1">Tier 3: Offline Sovereign Engine</span>
                            <h4 className="text-xs font-semibold text-[#1C1917] mb-1">Deterministic Advisory Rule Network</h4>
                            <p className="text-xs text-[#786C62] font-sans">Guarantees localized, instant weather guidance even under total external network disconnection.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: LIVING WEATHER UI */}
                    {docsTab === 'ui' && (
                      <div className="space-y-4">
                        <h3 className="text-base font-roman uppercase tracking-wider text-[#1C1917] flex items-center gap-2 font-semibold">
                          <Layers className="w-4 h-4 text-[#8C6D3B]" />
                          Spatial 3D Design Architecture
                        </h3>
                        <p className="text-sm text-[#786C62] leading-relaxed font-sans">
                          The entire AtmosIQ interface operates inside an interconnected Three.js WebGL spatial framework:
                        </p>

                        <div className="space-y-3 mt-4">
                          <div className="p-4 rounded-xl bg-[#F5EFEB]/70 border border-[#C5A880]/20">
                            <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] mb-1 font-semibold">Layer 1: Three.js Spatial Atmosphere</h4>
                            <p className="text-xs text-[#786C62] font-sans">Dynamic WebGL background simulating Rayleigh solar scattering, precipitation vectors, and celestial starfields.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F5EFEB]/70 border border-[#C5A880]/20">
                            <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] mb-1 font-semibold">Layer 2: 3D Horological Complications</h4>
                            <p className="text-xs text-[#786C62] font-sans">Interactive rotating brushed-gold wind compass dials and solar/lunar arc trackers with true physics damping.</p>
                          </div>
                          <div className="p-4 rounded-xl bg-[#F5EFEB]/70 border border-[#C5A880]/20">
                            <h4 className="text-xs font-roman uppercase tracking-wider text-[#1C1917] mb-1 font-semibold">Layer 3: 3D Atmospheric Celestial Globe</h4>
                            <p className="text-xs text-[#786C62] font-sans">Multi-ring longitude/latitude sphere with interactive inertial mouse navigation and live telemetry pins.</p>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </footer>
  );
};

export default Footer;
