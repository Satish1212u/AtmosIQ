import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CloudRain, Bot, Compass, HeartPulse, Search, Menu, X, Map as MapIcon, CalendarDays, Users } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

const Navbar = () => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { setCity, locationError } = useWeather();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setCity(search);
      setSearch('');
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <CloudRain className="w-4 h-4" /> },
    { name: 'Radar', path: '/radar', icon: <MapIcon className="w-4 h-4" /> },
    { name: 'Assistant', path: '/assistant', icon: <Bot className="w-4 h-4" /> },
    { name: 'Planner', path: '/planner', icon: <CalendarDays className="w-4 h-4" /> },
    { name: 'Travel', path: '/travel', icon: <Compass className="w-4 h-4" /> },
    { name: 'Health', path: '/health', icon: <HeartPulse className="w-4 h-4" /> },
    { name: 'Community', path: '/community', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 px-6 py-4 transition-all duration-300">
      <div className="absolute inset-0 glass-dark border-b border-white/5 opacity-90"></div>
      <div className="relative max-w-7xl mx-auto flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="w-11 h-11 rounded-xl bg-slate-950/60 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] group-hover:border-cyan-400/50 transition-all duration-300 overflow-hidden"
            >
              <img 
                src="/logo.png" 
                alt="AtmosIQ Logo" 
                className="w-full h-full object-contain p-0.5 scale-125" 
              />
            </motion.div>
            {/* Glowing ring animation on hover */}
            <span className="absolute -inset-0.5 rounded-xl bg-cyan-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></span>
          </div>
          <span className="text-2xl font-black tracking-tight font-mono text-white">
            Atmos<span className="text-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">IQ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-1 bg-black/40 rounded-full p-1.5 border border-white/10 shadow-inner">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/25 to-blue-500/25 border border-cyan-400/50 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-glow-cyan font-bold drop-shadow-md' : ''}`}>
                    {React.cloneElement(link.icon, { className: 'w-4 h-4' })}
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <form onSubmit={handleSearch} className="relative group flex-shrink-0">
            <input
              type="text"
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 xl:focus:w-64 transition-all duration-300 bg-slate-900/80 hover:bg-slate-900/95 border border-white/20 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-lg"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-300 group-focus-within:text-cyan-400 transition-colors" />
          </form>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full glass-dark border-b border-white/10 p-4 flex flex-col gap-4"
        >
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/40" />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-white/80"
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}

      {locationError && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="w-full bg-orange-500/20 border-t border-orange-500/30 px-6 py-2 flex items-center justify-center gap-2 text-sm text-orange-200"
        >
          <span>📍 {locationError} You can still use the search bar to find weather for any city!</span>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
