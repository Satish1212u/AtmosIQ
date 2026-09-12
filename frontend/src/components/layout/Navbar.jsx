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
      <div className="absolute inset-0 bg-white/75 backdrop-blur-xl border-b border-[#C5A880]/20 shadow-[0_4px_25px_rgba(60,48,35,0.03)]"></div>
      <div className="relative max-w-7xl mx-auto flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: [0, -4, 4, 0] }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#C5A880]/40 flex items-center justify-center shadow-sm group-hover:border-[#B89758] transition-all duration-300 overflow-hidden"
            >
              <img 
                src="/logo.png" 
                alt="AtmosIQ Logo" 
                className="w-full h-full object-contain p-0.5 scale-110" 
              />
            </motion.div>
            <span className="absolute -inset-0.5 rounded-xl bg-[#C5A880]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></span>
          </div>
          <span className="text-2xl font-editorial font-bold tracking-tight text-[#1C1917]">
            Atmos<span className="font-roman text-[#B89758] ml-0.5">IQ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-1 bg-white/80 rounded-full p-1.5 border border-[#C5A880]/30 shadow-[0_2px_12px_rgba(60,48,35,0.04)] backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                    isActive ? 'text-[#8C6D3F]' : 'text-[#6B5E51] hover:text-[#1C1917] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-[#F7F2E9] border border-[#C5A880]/60 rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 350, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${isActive ? 'font-bold text-[#8C6D3F]' : ''}`}>
                    {React.cloneElement(link.icon, { className: 'w-3.5 h-3.5' })}
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <form onSubmit={handleSearch} className="relative group flex-shrink-0">
            <input
              type="text"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 xl:focus:w-64 transition-all duration-300 bg-white/85 hover:bg-white border border-[#C5A880]/30 rounded-full py-2 pl-9 pr-4 text-xs font-medium text-[#1C1917] placeholder-[#A89D8F] focus:outline-none focus:border-[#B89758] focus:ring-2 focus:ring-[#B89758]/20 shadow-sm"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#A89D8F] group-focus-within:text-[#B89758] transition-colors" />
          </form>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-[#1C1917]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-[#C5A880]/20 p-4 flex flex-col gap-3 shadow-lg"
        >
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#C5A880]/30 rounded-full py-2.5 pl-10 pr-4 text-sm text-[#1C1917] focus:outline-none focus:border-[#B89758]"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#A89D8F]" />
          </form>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5EFEB] text-[#443E38] font-medium text-sm"
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
          className="w-full bg-[#FAF0E6] border-t border-[#E8C4A2] px-6 py-2 flex items-center justify-center gap-2 text-xs text-[#8C4A20]"
        >
          <span>📍 {locationError} You can still use the search bar to find weather for any city!</span>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
