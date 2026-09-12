import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import { Bot, X } from 'lucide-react';

const WelcomeToast = () => {
  const { welcomeMessage, setWelcomeMessage } = useWeather();

  useEffect(() => {
    if (welcomeMessage) {
      const timer = setTimeout(() => {
        setWelcomeMessage(null);
      }, 8000); // Hide after 8 seconds
      return () => clearTimeout(timer);
    }
  }, [welcomeMessage, setWelcomeMessage]);

  return (
    <AnimatePresence>
      {welcomeMessage && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-24 right-6 z-50 luxury-panel p-5 rounded-2xl max-w-sm shadow-[0_20px_50px_rgba(28,25,23,0.15)] border border-[#C5A880]/30"
        >
          <div className="flex items-start gap-3.5 relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FAF8F5] to-[#EDE6DA] border border-[#C5A880]/40 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="text-[#8C6D3B] w-5 h-5" />
            </div>
            <div className="pr-4">
              <div className="text-[10px] font-roman uppercase tracking-[0.2em] text-[#8C6D3B] mb-1 font-semibold">AtmosIQ Atelier</div>
              <p className="text-xs text-[#2A2421]/90 leading-relaxed font-sans">
                {welcomeMessage}
              </p>
            </div>
            <button 
              onClick={() => setWelcomeMessage(null)}
              className="absolute -top-1 -right-1 text-[#2A2421]/40 hover:text-[#1C1917] transition-colors p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeToast;
