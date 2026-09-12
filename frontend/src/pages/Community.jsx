import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, AlertTriangle, CloudFog, CloudRain, Sun, Send, MapPin, Sparkles } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const initialReports = [
  { id: 1, user: 'Alex M.', location: 'Geneva Quayside', time: '12 mins ago', type: 'Fog', text: 'Advective lake fog settling across the lower harbor quays. Visibility reduced to ~800 meters.' },
  { id: 2, user: 'Sarah K.', location: 'Alpine Foothills', time: '28 mins ago', type: 'Rain', text: 'Precipitation front arrived with sudden squall lines. Road friction index degraded.' },
  { id: 3, user: 'Mike T.', location: 'Upper Terrace', time: '1 hour ago', type: 'Clear', text: 'High pressure ridge dominant. Crystalline solar clarity with zero atmospheric turbulence.' }
];

const Community = () => {
  const { city } = useWeather();
  const [reports, setReports] = useState(initialReports);
  const [newReport, setNewReport] = useState('');
  const [selectedType, setSelectedType] = useState('Rain');

  const types = [
    { name: 'Rain', icon: <CloudRain className="w-3.5 h-3.5" /> },
    { name: 'Fog', icon: <CloudFog className="w-3.5 h-3.5" /> },
    { name: 'Hazard', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { name: 'Clear', icon: <Sun className="w-3.5 h-3.5" /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReport.trim()) return;

    const report = {
      id: Date.now(),
      user: 'You',
      location: city || 'Local Station',
      time: 'Just now',
      type: selectedType,
      text: newReport
    };

    setReports([report, ...reports]);
    setNewReport('');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Rain': return <CloudRain className="w-4 h-4 text-[#57493A]" />;
      case 'Fog': return <CloudFog className="w-4 h-4 text-[#786E65]" />;
      case 'Hazard': return <AlertTriangle className="w-4 h-4 text-[#B35446]" />;
      case 'Clear': return <Sun className="w-4 h-4 text-[#C68A4C]" />;
      default: return <MessageSquare className="w-4 h-4 text-[#B89758]" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
      
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-[#C5A880]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-roman tracking-[0.25em] text-[#8C6D3F] uppercase block mb-1">
            METEOROLOGICAL SALON · DISPATCH SPEC 04
          </span>
          <h1 className="text-3xl md:text-4xl font-editorial font-bold text-[#1C1917] tracking-tight">
            Climate Community Journal
          </h1>
          <p className="text-xs text-[#57493A] font-medium mt-0.5">
            Peer-verified atmospheric field observations across regional station nodes.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 border border-[#C5A880]/30 shadow-xs">
          <Users className="w-3.5 h-3.5 text-[#B89758]" />
          <span className="text-[10px] font-roman tracking-wider uppercase text-[#6B5E51]">
            ACTIVE NETWORK WITNESSES
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Submit Observation Plaque (Left Column) */}
        <div className="md:col-span-1 space-y-6">
          <div className="luxury-panel p-6 rounded-3xl shadow-sm">
            <span className="text-[9px] font-roman tracking-[0.2em] text-[#786E65] uppercase block mb-1 font-bold">
              FIELD OBSERVATION
            </span>
            <h2 className="text-xl font-editorial font-bold text-[#1C1917] mb-4">
              File a Station Report
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-roman text-[#786E65] uppercase tracking-wider mb-2">
                  PHENOMENON TYPE
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {types.map((t) => {
                    const isSel = selectedType === t.name;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setSelectedType(t.name)}
                        className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-roman uppercase tracking-wider transition-all border cursor-pointer ${
                          isSel 
                            ? 'bg-[#FAF5ED] border-[#B89758] text-[#8C6D3F] font-bold shadow-xs' 
                            : 'bg-white/60 border-[#C5A880]/20 text-[#57493A] hover:bg-white'
                        }`}
                      >
                        {t.icon} {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-roman text-[#786E65] uppercase tracking-wider mb-1.5">
                  DESCRIPTIVE EVIDENCE
                </label>
                <textarea 
                  value={newReport}
                  onChange={(e) => setNewReport(e.target.value)}
                  placeholder="Record micro-climate observations, road surface conditions, visibility..."
                  className="w-full bg-[#FAF8F5] border border-[#C5A880]/30 rounded-xl p-3 text-xs text-[#1C1917] font-medium focus:outline-none focus:border-[#B89758] focus:ring-1 focus:ring-[#B89758]/20 h-24 resize-none placeholder-[#A89D8F] shadow-inner"
                  required
                />
              </div>

              <button 
                type="submit"
                className="luxury-gold-btn w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs font-roman flex justify-center items-center gap-2 cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> BROADCAST TO NETWORK
              </button>
            </form>
          </div>

          <div className="luxury-panel-champagne p-6 rounded-3xl shadow-sm">
            <span className="text-[9px] font-roman tracking-[0.2em] text-[#8C6D3F] uppercase block mb-1 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B89758]" />
              ATELIER SYNTHESIS
            </span>
            <p className="text-xs text-[#443E38] font-medium leading-relaxed">
              Consensus telemetry reports a localized advective fog bank in low-altitude corridors. Commuters should maintain increased vehicular headway and dipped beams.
            </p>
          </div>
        </div>

        {/* Live Journal Dispatches Feed (Right 2 Columns) */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-editorial font-bold text-[#1C1917]">
              Live Regional Field Dispatches
            </h2>
            <span className="text-[10px] font-roman text-[#786E65] uppercase tracking-widest">
              CHRONOLOGICAL FEED
            </span>
          </div>
          
          <div className="space-y-3.5 max-h-[64vh] overflow-y-auto pr-1.5">
            {reports.map((report) => (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="luxury-card-3d p-5 rounded-2xl border-l-2 border-l-[#B89758] flex gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF5ED] border border-[#C5A880]/30 flex items-center justify-center shrink-0">
                  {getIcon(report.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-0.5">
                    <span className="font-roman text-xs font-bold text-[#1C1917] tracking-wider">{report.user}</span>
                    <span className="text-[10px] font-roman text-[#786E65] uppercase">{report.time}</span>
                  </div>
                  <div className="text-[11px] text-[#8C6D3F] mb-2 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-[#B89758]" /> {report.location}
                  </div>
                  <p className="text-xs md:text-sm text-[#443E38] font-medium leading-relaxed">
                    {report.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Community;
