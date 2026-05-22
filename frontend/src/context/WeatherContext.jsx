import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWeather, fetchForecast, fetchWeatherByLocation, fetchForecastByLocation, fetchAirQuality } from '../services/weatherApi';

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  
  // Memory System
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('atmosiq_profile');
    return saved ? JSON.parse(saved) : { name: 'User', favorites: [], preferences: { unit: 'metric' } };
  });
  const [welcomeMessage, setWelcomeMessage] = useState(null);

  const updateProfile = (updates) => {
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    localStorage.setItem('atmosiq_profile', JSON.stringify(updated));
  };

  const loadData = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      const current = await fetchWeather(cityName);
      const [future, air] = await Promise.all([
        fetchForecast(cityName),
        current.coord ? fetchAirQuality(current.coord.lat, current.coord.lon).catch(err => {
          console.warn("AQI fetch failed, using fallback:", err);
          return null;
        }) : Promise.resolve(null)
      ]);
      setWeather(current);
      setForecast(future);
      setAirQuality(air);
      setCity(current.name);
    } catch (err) {
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const loadDataByLocation = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      const [current, future, air] = await Promise.all([
        fetchWeatherByLocation(lat, lon),
        fetchForecastByLocation(lat, lon),
        fetchAirQuality(lat, lon).catch(err => {
          console.warn("AQI fetch failed, using fallback:", err);
          return null;
        })
      ]);
      setWeather(current);
      setForecast(future);
      setAirQuality(air);
      setCity(current.name);
      
      // Generate AI Welcome Message dynamically based on time and weather
      const hour = new Date().getHours();
      let greeting = 'Good Evening';
      if (hour < 12) greeting = 'Good Morning';
      else if (hour < 17) greeting = 'Good Afternoon';
      
      setWelcomeMessage(`${greeting} ${userProfile.name}.\nAtmosIQ Core Online.\nSynchronized with ${current.name} environmental telemetry core: ${Math.round(current.main.temp)}°C, ${current.weather[0].description}.`);

    } catch (err) {
      setError('Failed to fetch weather data for location.');
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          loadDataByLocation(latitude, longitude);
        },
        (err) => {
          console.warn("Location permission denied or error:", err);
          setLocationError("Location permission denied. Showing default city.");
          loadData('New York');
        }
      );
    } else {
      loadData('New York');
    }
  };

  return (
    <WeatherContext.Provider value={{ 
      city, weather, forecast, airQuality, loading, error, locationError, 
      userProfile, updateProfile, welcomeMessage, setWelcomeMessage, 
      setCity: loadData, requestLocation
    }}>
      {children}
    </WeatherContext.Provider>
  );
};
