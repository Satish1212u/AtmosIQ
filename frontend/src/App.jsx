import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WeatherProvider } from './context/WeatherContext';
import DynamicBackground from './animations/DynamicBackground';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Assistant from './pages/Assistant';
import TravelChecker from './pages/Travel';
import HealthAQI from './pages/HealthAQI';

import WelcomeToast from './components/WelcomeToast';
import RadarMap from './pages/Radar';
import Planner from './pages/Planner';
import Community from './pages/Community';
import Footer from './components/layout/Footer';

function App() {
  return (
    <WeatherProvider>
      <DynamicBackground>
        <WelcomeToast />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/travel" element={<TravelChecker />} />
            <Route path="/health" element={<HealthAQI />} />
            <Route path="/radar" element={<RadarMap />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/community" element={<Community />} />
          </Routes>
          <Footer />
        </Router>
      </DynamicBackground>
    </WeatherProvider>
  );
}

export default App;
