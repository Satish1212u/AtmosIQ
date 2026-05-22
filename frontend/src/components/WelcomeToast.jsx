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
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-24 right-6 z-50 glass border-cyan-500/30 p-4 rounded-2xl max-w-sm shadow-2xl"
        >
          <div className="flex items-start gap-3 relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center shrink-0">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-400 mb-1">AtmosIQ Core</div>
              <p className="text-sm text-white/90 whitespace-pre-line leading-relaxed">
                {welcomeMessage}
              </p>
            </div>
            <button 
              onClick={() => setWelcomeMessage(null)}
              className="absolute -top-2 -right-2 text-white/40 hover:text-white transition-colors"
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
