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
    <footer className="relative mt-auto w-full z-50 overflow-hidden bg-slate-950/45 border-t border-white/5 backdrop-blur-md">
      
      {/* Top Animated Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/80 to-transparent opacity-70 shadow-[0_0_15px_rgba(34,211,238,0.8)]"></div>

      {/* Ambient Glow Atmosphere */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-44 bg-gradient-to-t from-cyan-900/10 via-blue-900/5 to-transparent blur-[120px] pointer-events-none rounded-t-full"></div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        
        {/* Upper Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Narrative (Covers 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-950/80 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)]">
                <img 
                  src="/logo.png" 
                  alt="AtmosIQ Logo" 
                  className="w-full h-full object-contain p-0.5 scale-125 transition-transform duration-700 group-hover:scale-135 group-hover:rotate-6" 
                />
                <span className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </div>
              <span className="text-2xl font-black tracking-tight font-mono text-white">
                Atmos<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]">IQ</span>
              </span>
            </div>
            
            <p className="text-slate-200 text-sm font-semibold leading-relaxed max-w-sm">
              Next-generation climate intelligence system, providing hyper-local forecasts, live atmospheric analytics, and conversational advisory insights through secured cascading model logic.
            </p>

            {/* Live Telemetry Pulse Line */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950/70 border border-white/10 shadow-inner backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </span>
              <span className="text-[11px] font-black tracking-widest text-slate-300 uppercase flex items-center gap-1.5 font-mono">
                AtmosIQ Systems Operational <span className="opacity-40">•</span> AI Gateway Online
              </span>
            </div>
          </div>

          {/* Column 2: Climate Intelligence */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Climate Intelligence
            </h3>
            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <Link to="/health" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  AQI Monitoring
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  Weather Analytics
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  AI Forecasting
                </Link>
              </li>
              <li>
                <Link to="/travel" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  Travel Intelligence
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              Platform
            </h3>
            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <Link to="/assistant" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  Visual Analysis
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  Climate Reports
                </Link>
              </li>
              <li>
                <Link to="/" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  Living Weather UI
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Developer */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              Developer
            </h3>
            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <button onClick={() => openDocsAt('api')} className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  API Docs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveModal('status')} className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  System Status
                </button>
              </li>
              <li>
                <button onClick={() => openDocsAt('stack')} className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group text-left cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  Backend Architecture
                </button>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-cyan-500/50 group-hover:translate-x-0.5 transition-transform" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Row Divider Line */}
        <div className="w-full h-px bg-white/5 mb-8"></div>

        {/* Bottom Section: Telemetry Info, Modals, Copyrights, & Socials */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Metadata Telemetry Label */}
          <div className="text-xs font-mono text-slate-400 font-bold bg-slate-900/60 border border-white/5 px-4.5 py-2.5 rounded-full shadow-inner tracking-wider">
            v2.4.1 • AWS-ap-south-1 ({weather?.name || 'Local'} Node) • 142ms AI Latency
          </div>

          {/* Social Icons & External Links */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" target="_blank" rel="noopener noreferrer" 
              className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] group"
            >
              <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] group"
            >
              <svg className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a 
              href="mailto:support@atmosiq.io"
              className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] group"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a 
              href="https://unsplash.com" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyan-400 transition-all hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] group"
            >
              <Globe className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>

          {/* Privacy & Legal Anchors */}
          <div className="flex items-center gap-6 text-sm font-semibold text-slate-300">
            <button 
              onClick={() => setActiveModal('privacy')} 
              className="hover:text-cyan-400 transition-colors cursor-pointer relative group"
            >
              Privacy Policy
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </button>
            <span className="opacity-20 text-slate-500">|</span>
            <button 
              onClick={() => setActiveModal('terms')} 
              className="hover:text-cyan-400 transition-colors cursor-pointer relative group"
            >
              Terms of Service
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

        </div>

        {/* Small copyright disclaimer at the bottom */}
        <div className="text-center text-[11px] text-slate-400 font-bold mt-10 tracking-widest uppercase">
          © {new Date().getFullYear()} AtmosIQ. Powered by Live AI Meteorological Arrays. All Rights Reserved.
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
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto glass-dark rounded-[2.5rem] border border-white/15 p-6 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.85)] z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* 🔒 PRIVACY MODAL CONTENT */}
              {activeModal === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3.5 mb-2 border-b border-white/10 pb-4">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Telemetry & Privacy Standards</h2>
                      <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mt-0.5">Secure Climate Analytics Protocols</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                    AtmosIQ enforces state-of-the-art security standard frameworks. We operate with strict query isolation and secure data transmission protocols to keep your geographical, search, and conversational activities confidential.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 shadow-inner">
                      <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Data Encryption & Transits
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                        All metadata transactions, local configurations, and weather API sync states are secured in transit via SSL/TLS and encrypted at rest with AES-256 standards.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 shadow-inner">
                      <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        No Location Persistent Storage
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                        Your device coordinates are requested purely to calculate real-time forecasts, local AQI, and UV levels. AtmosIQ does not compile persistent historical location profiling maps.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 shadow-inner">
                      <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Secure AI Gateway Router
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                        All chatbot dialogs processed through our secured cascading AI endpoint are fully anonymized. Conversations are processed dynamically without tracking tags.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 shadow-inner">
                      <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Proxied API Connections
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                        All third-party weather API requests are tunneled through secure Express proxies. Your IP and personal metadata are never exposed to external vendors.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed font-semibold flex gap-3 mt-4">
                    <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Compliance Note:</strong> AtmosIQ fully supports international data standards including GDPR, CCPA, and COPPA frameworks. We operate with a strict zero-ad-tracker policy.
                    </span>
                  </div>
                </div>
              )}

              {/* ⚖️ TERMS MODAL CONTENT */}
              {activeModal === 'terms' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3.5 mb-2 border-b border-white/10 pb-4">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Terms of Platform Operations</h2>
                      <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mt-0.5">User Guidelines & Disclaimer Agreements</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                    By launching or accessing AtmosIQ Climate Intelligence systems, you explicitly agree to the standard terms of operation and guidelines outlined below.
                  </p>

                  <div className="space-y-4 mt-6">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/15 flex items-center justify-center shrink-0 font-bold text-xs text-cyan-400">1</div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">AI-Generated Climate Recommendations</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                          Platform insights, suggestion chips, and conversational recommendations generated by Gemini model cascades are powered by standard AI systems. They are formulated for general advisory and informational purposes. They **must not** be treated as a replacement for emergency directives or official meteorological hazard commands.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/15 flex items-center justify-center shrink-0 font-bold text-xs text-cyan-400">2</div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Meteorological Sensor Limits</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                          Live weather values, AQI graphs, and UV indices depend on active global sensor networks. Local values are subject to regional radar latencies, microclimatic anomalies, and device precision states. We cannot guarantee 100% mathematical certainty on forecasting models.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/15 flex items-center justify-center shrink-0 font-bold text-xs text-cyan-400">3</div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Attribution & Local Renders</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                          Weather data is fetched from OpenWeatherMap API arrays. Atmospheric backdrops and animated climate systems are computed dynamically offline on the client side using specialized CSS frameworks.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-white/15 flex items-center justify-center shrink-0 font-bold text-xs text-cyan-400">4</div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">Public Request Boundaries</h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                          Free public access is rate-limited to 100 requests per hour per unique IP address. High-volume scraping, API abuse, or malicious prompt injection efforts are monitored and blocked automatically.
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
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white">System Operations Status</h2>
                        <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mt-0.5">Live Meteorological & AI Telemetry Dashboard</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleRefreshStatus}
                      className={`p-2.5 rounded-xl border border-white/10 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-400 bg-slate-900/60 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${refreshingStatus ? 'opacity-50' : ''}`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${refreshingStatus ? 'animate-spin' : ''}`} />
                      Refresh Indicators
                    </button>
                  </div>

                  {/* Summary telemetry cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 text-center flex flex-col justify-center shadow-inner">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Overall System Status</span>
                      <span className="text-2xl font-black text-emerald-400 flex items-center justify-center gap-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        Operational
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 text-center flex flex-col justify-center shadow-inner">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Average System Uptime</span>
                      <span className="text-2xl font-black text-white font-mono">99.98%</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/5 text-center flex flex-col justify-center shadow-inner">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">AI Gateway Latency</span>
                      <span className="text-2xl font-black text-cyan-400 font-mono flex items-center justify-center gap-1.5">
                        <Cpu className="w-5 h-5 text-cyan-400" />
                        142ms
                      </span>
                    </div>
                  </div>

                  {/* Operational indicators list */}
                  <div className="space-y-3.5 mt-8">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 border-l-2 border-cyan-400 pl-2">System Integrations status</h3>
                    
                    <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-sm font-bold text-white leading-none">Weather API Gateway</p>
                          <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">OpenWeatherMap Array · Sync Active</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        Operational • 99.98%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Compass className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-sm font-bold text-white leading-none">Air Quality (AQI) Sensor Array</p>
                          <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">PM2.5 / PM10 telemetry feeder</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        Operational • 100.00%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Bot className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-sm font-bold text-white leading-none">AI Gateway Cascade Router</p>
                          <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">Gemini Model Fallback Layer</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        Operational • 99.92%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-sm font-bold text-white leading-none">Atmosphere Particle Render Engine</p>
                          <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">Dynamic Offline Shader Systems · Particles Active</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        Operational • 100.00%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-sm font-bold text-white leading-none">Database Storage System</p>
                          <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">MongoDB Atlas Cluster · Shard-1 Connected</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        Operational • 100.00%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4.5 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-sm font-bold text-white leading-none">AI Orchestration Engine</p>
                          <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">Rule Engine & Safety Cascade Node</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        Operational • Healthy
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 📖 DOCUMENTATION PORTAL CONTENT */}
              {activeModal === 'docs' && (
                <div className="space-y-6">
                  
                  {/* Header Title */}
                  <div className="flex items-center gap-3.5 mb-2 border-b border-white/10 pb-4">
                    <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 text-cyan-400">
                      <Code className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">Developer Portal</h2>
                      <p className="text-xs text-slate-300 font-bold uppercase tracking-widest mt-0.5">Platform Architecture, APIs, & AI Engine Docs</p>
                    </div>
                  </div>

                  {/* Double Row Tab Interface */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
                    <button
                      onClick={() => setDocsTab('stack')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${docsTab === 'stack' ? 'bg-cyan-500/25 border border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border border-white/5 text-slate-300 hover:text-white'}`}
                    >
                      ⚙️ Stack & Architecture
                    </button>
                    
                    <button
                      onClick={() => setDocsTab('api')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${docsTab === 'api' ? 'bg-cyan-500/25 border border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border border-white/5 text-slate-300 hover:text-white'}`}
                    >
                      🔌 Secure API Gateways
                    </button>
                    
                    <button
                      onClick={() => setDocsTab('ai')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${docsTab === 'ai' ? 'bg-cyan-500/25 border border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border border-white/5 text-slate-300 hover:text-white'}`}
                    >
                      🤖 AI model Cascade
                    </button>
                    
                    <button
                      onClick={() => setDocsTab('ui')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${docsTab === 'ui' ? 'bg-cyan-500/25 border border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border border-white/5 text-slate-300 hover:text-white'}`}
                    >
                      🎨 Living Weather UI
                    </button>
                  </div>

                  {/* Content based on Tab */}
                  <div className="mt-6 space-y-6">
                    
                    {/* TAB: STACK */}
                    {docsTab === 'stack' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Cpu className="w-5 h-5 text-cyan-400" />
                          Platform Technologies
                        </h3>
                        <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                          AtmosIQ is architected with a decoupled model representing a modern React-Vite client linked with a robust Express backend core.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                          <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 shadow-inner space-y-3">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">Frontend Stack</span>
                            <ul className="space-y-2 text-xs font-semibold text-slate-300">
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <strong>Vite + React:</strong> Widescreen virtual DOM rendering
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <strong>Framer Motion:</strong> Staggered transitions and typewriter streams
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <strong>tsParticles:</strong> Live interactive weather canvases
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <strong>Lucide:</strong> High-definition interface glyphs
                              </li>
                            </ul>
                          </div>

                          <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 shadow-inner space-y-3">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">Backend Security & Server</span>
                            <ul className="space-y-2 text-xs font-semibold text-slate-300">
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <strong>Express Server:</strong> Production-ready REST routing
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <strong>Helmet Security:</strong> Cross-Origin & header protectors
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <strong>MongoDB & Mongoose:</strong> Persistent configuration maps
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <strong>Pino Logger:</strong> High-speed structured logs
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: API */}
                    {docsTab === 'api' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Terminal className="w-5 h-5 text-cyan-400" />
                          Secure API Core Endpoints
                        </h3>
                        <p className="text-sm text-slate-200 leading-relaxed font-semibold font-sans">
                          Our backend proxy hides all third-party developer secrets. No API keys ever cross the client. We expose secure Express gateways for real-time conversational AI and localized climate intelligence:
                        </p>

                        <div className="space-y-6 mt-4">
                          {/* Endpoint 1 */}
                          <div className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3 font-semibold">
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono">POST</span>
                              <span className="text-sm font-mono text-white">/api/v1/ai/chat</span>
                            </div>
                            <p className="text-xs text-slate-300">
                              Routes conversational prompts to the Gemini model cascade, processing local weather context parameters to generate personalized dynamic climate insights.
                            </p>
                            <div className="bg-slate-900 border border-white/5 rounded-xl p-3.5 font-mono text-xs text-slate-300 overflow-x-auto">
                              <p className="text-slate-500 font-bold mb-1.5">// Payload: message, weatherContext</p>
                              {`curl -X POST "https://atmosiq-18gz.onrender.com/api/v1/ai/chat" \\
                                -H "Content-Type: application/json" \\
                                -d '{ "message": "Should I go out today?", "weatherContext": { "temp": 28, "condition": "Clear" } }'`}
                            </div>
                            <div className="bg-slate-900 border border-white/5 rounded-xl p-3.5 font-mono text-xs text-slate-300 overflow-x-auto space-y-1">
                              <p className="text-slate-500 font-bold mb-1.5">// Response JSON Example:</p>
                              <pre className="text-cyan-300">{`{
  "success": true,
  "response": "With clear skies and temperatures at a comfortable 28°C, it's a perfect day for outdoor activities. Just remember sunscreen!"
}`}</pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: AI MODEL CASCADE */}
                    {docsTab === 'ai' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Bot className="w-5 h-5 text-cyan-400" />
                          Gemini Cascade Router Architecture
                        </h3>
                        <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                          The AtmosIQ conversational core operates with automatic, fail-safe model degradation rules to ensure near-zero downtime. When the user queries the chatbot:
                        </p>

                        <div className="space-y-4 mt-6">
                          <div className="flex gap-4 items-start p-4 rounded-xl bg-slate-950/60 border border-white/5">
                            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 font-mono text-xs">Tier 1</div>
                            <div>
                              <h4 className="text-sm font-bold text-white leading-none mb-1">gemini-2.0-flash</h4>
                              <p className="text-xs text-slate-300 leading-relaxed font-semibold mt-1">
                                Primary operational model. Used for parsing and generating high-speed weather tips and interactive recommendations.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 items-start p-4 rounded-xl bg-slate-950/60 border border-white/5">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 font-mono text-xs">Tier 2</div>
                            <div>
                              <h4 className="text-sm font-bold text-white leading-none mb-1">gemini-1.5-flash / gemini-1.5-pro</h4>
                              <p className="text-xs text-slate-300 leading-relaxed font-semibold mt-1">
                                Secondary fallback models. Triggered automatically if Tier 1 yields 429 quota exceptions or gateway timeouts.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4 items-start p-4 rounded-xl bg-slate-950/60 border border-white/5">
                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400 font-mono text-xs">Tier 3</div>
                            <div>
                              <h4 className="text-sm font-bold text-white leading-none mb-1">Local Rule Engine</h4>
                              <p className="text-xs text-slate-300 leading-relaxed font-semibold mt-1">
                                Safe rule-based localized engine. If completely offline or remote API queries collapse, this model instantly parses telemetry to output advisory tips safely.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: LIVING WEATHER UI */}
                    {docsTab === 'ui' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Layers className="w-5 h-5 text-cyan-400" />
                          Living Weather UI Rendering Engine
                        </h3>
                        <p className="text-sm text-slate-200 leading-relaxed font-semibold">
                          Our interface updates dynamically in response to physical changes at your coordinates. The background operates on canvas layer stacking:
                        </p>

                        <div className="space-y-4.5 mt-6 font-semibold">
                          <div className="p-4.5 rounded-2xl bg-slate-950/70 border border-white/5 shadow-inner">
                            <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider mb-2">Layer 1: Real Location Photo Canvas</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              Fetches optimized city portrait imagery matching live weather tags, allowing a full widescreen presentation with a scale transitions zoom vector.
                            </p>
                          </div>

                          <div className="p-4.5 rounded-2xl bg-slate-950/70 border border-white/5 shadow-inner">
                            <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider mb-2">Layer 2: Diurnal & Weather Overlay Tint</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              Applies custom gradients to guarantee typography contrasts. For instance, cloudy nights trigger deep indigo shading, while hot clear afternoons cast soft amber sun glows.
                            </p>
                          </div>

                          <div className="p-4.5 rounded-2xl bg-slate-950/70 border border-white/5 shadow-inner">
                            <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider mb-2">Layer 3: Live tsParticles Engine</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              Launches dynamic physics simulations. Raindrops drop at custom wind-shear angles, snowflakes drift in soft sine waves, and clear night skies display twinkling star systems.
                            </p>
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
