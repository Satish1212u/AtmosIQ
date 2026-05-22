import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, AlertTriangle, CloudFog, CloudRain, Sun, Send } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

const initialReports = [
  { id: 1, user: 'Alex M.', location: 'Downtown', time: '10 mins ago', type: 'Fog', text: 'Heavy fog near the river, visibility is very low.' },
  { id: 2, user: 'Sarah K.', location: 'North District', time: '25 mins ago', type: 'Rain', text: 'Sudden downpour started. The roads are getting slippery.' },
  { id: 3, user: 'Mike T.', location: 'East Side', time: '1 hour ago', type: 'Clear', text: 'Sun is finally out! Beautiful day.' }
];

const Community = () => {
  const { city } = useWeather();
  const [reports, setReports] = useState(initialReports);
  const [newReport, setNewReport] = useState('');
  const [selectedType, setSelectedType] = useState('Rain');

  const types = [
    { name: 'Rain', icon: <CloudRain className="w-4 h-4" /> },
    { name: 'Fog', icon: <CloudFog className="w-4 h-4" /> },
    { name: 'Hazard', icon: <AlertTriangle className="w-4 h-4" /> },
    { name: 'Clear', icon: <Sun className="w-4 h-4" /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReport.trim()) return;

    const report = {
      id: Date.now(),
      user: 'You',
      location: city || 'Current Location',
      time: 'Just now',
      type: selectedType,
      text: newReport
    };

    setReports([report, ...reports]);
    setNewReport('');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Rain': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'Fog': return <CloudFog className="w-5 h-5 text-gray-400" />;
      case 'Hazard': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'Clear': return <Sun className="w-5 h-5 text-yellow-400" />;
      default: return <MessageSquare className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black flex items-center gap-3 mb-2 tracking-tight">
          <Users className="w-10 h-10 text-emerald-400 animate-pulse" />
          AtmosIQ Community
        </h1>
        <p className="text-white/70 text-lg">Real-time crowdsourced atmospheric reports from regional AtmosIQ nodes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Submit Report */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-6 rounded-3xl">
            <h2 className="text-xl font-bold mb-4">Submit a Report</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Condition Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {types.map((t) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => setSelectedType(t.name)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-sm transition-all border ${
                        selectedType === t.name 
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {t.icon} {t.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Description</label>
                <textarea 
                  value={newReport}
                  onChange={(e) => setNewReport(e.target.value)}
                  placeholder="What's happening right now?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-400 h-24 resize-none"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex justify-center items-center gap-2"
              >
                <Send className="w-4 h-4" /> Broadcast
              </button>
            </form>
          </div>

          <div className="glass p-6 rounded-3xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border-cyan-500/30">
            <h3 className="font-bold text-cyan-300 mb-2">AtmosIQ Regional Summary</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Based on recent local reports, there is a localized fog patch moving across the downtown area affecting visibility. Commuters should exercise caution.
            </p>
          </div>
        </div>

        {/* Feed */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-4">Live Reports near {city || 'you'}</h2>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {reports.map((report) => (
              <motion.div 
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-5 rounded-2xl border-l-4 border-l-cyan-400 flex gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center shrink-0">
                  {getIcon(report.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-white/90">{report.user}</span>
                    <span className="text-xs text-white/50">{report.time}</span>
                  </div>
                  <div className="text-xs text-cyan-400 mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {report.location}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
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

// Quick mock import for icon since it wasn't in lucide-react destructuring above
import { MapPin } from 'lucide-react';

export default Community;
