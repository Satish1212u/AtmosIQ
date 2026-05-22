import { useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';

export const useAtmosphere = () => {
  const { weather, airQuality } = useWeather();

  const atmosphere = useMemo(() => {
    // 1. Determine Condition
    const condition = weather?.weather?.[0]?.main?.toLowerCase() || 'clear';
    const conditionId = weather?.weather?.[0]?.id || 800;
    const temp = weather?.main?.temp || 20;

    // 2. Day/Night Cycle
    const now = Math.floor(Date.now() / 1000);
    const sunrise = weather?.sys?.sunrise || now - 3600;
    const sunset = weather?.sys?.sunset || now + 3600;
    const isNight = now < sunrise || now > sunset;

    // Refined condition combining basic condition and day/night state
    let activeCondition = condition;
    if (isNight && (condition === 'clear' || condition === 'clouds')) {
      activeCondition = 'night';
    } else if (temp > 35 && condition === 'clear') {
      activeCondition = 'heat';
    }

    // 3. Telemetry Processing
    // Wind: Convert to m/s if it isn't already, ensure safe fallback
    const windSpeed = weather?.wind?.speed || 0; 
    
    // Humidity: 0-100 scale
    const humidity = weather?.main?.humidity || 50;
    const humidityLevel = humidity > 85 ? 'high' : humidity > 60 ? 'medium' : 'low';
    
    // AQI: 1 (Good) to 5 (Very Poor) -> default to 1
    const aqi = airQuality?.list?.[0]?.main?.aqi || 1;
    const aqiLevel = aqi >= 4 ? 'high' : aqi === 3 ? 'moderate' : 'good';

    return {
      condition: activeCondition, // 'rain', 'thunderstorm', 'clear', 'clouds', 'snow', 'mist', 'haze', 'night', 'heat'
      rawCondition: condition,
      conditionId,
      isNight,
      windSpeed,
      humidity,
      humidityLevel,
      aqi,
      aqiLevel,
      temp,
    };
  }, [weather, airQuality]);

  return atmosphere;
};
