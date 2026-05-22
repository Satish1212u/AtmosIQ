import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Fallback mock data
const MOCK_WEATHER = {
  main: { temp: 24, humidity: 65, pressure: 1012 },
  weather: [
    {
      main: 'Clear',
      description: 'clear sky',
      icon: '01d'
    }
  ],
  wind: { speed: 4.5 },
  name: 'New York',
  sys: {
    sunrise: 1680000000,
    sunset: 1680050000
  }
};

// WEATHER (Direct OpenWeather API)
export const fetchWeather = async (city) => {
  if (!API_KEY) {
    console.warn("No OpenWeather API key found. Using mock data.");
    return { ...MOCK_WEATHER, name: city || 'Mock City' };
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
};

// FORECAST (Direct OpenWeather API)
export const fetchForecast = async (city) => {
  if (!API_KEY) {
    return {
      list: Array(40)
        .fill(MOCK_WEATHER)
        .map((w, i) => ({
          ...w,
          dt_txt: new Date(Date.now() + i * 10800000).toISOString()
        }))
    };
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

// WEATHER BY LOCATION (Direct OpenWeather API)
export const fetchWeatherByLocation = async (lat, lon) => {
  if (!API_KEY) {
    return { ...MOCK_WEATHER, name: 'Current Location' };
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather by location:", error);
    throw error;
  }
};

// FORECAST BY LOCATION (Direct OpenWeather API)
export const fetchForecastByLocation = async (lat, lon) => {
  if (!API_KEY) {
    return {
      list: Array(40)
        .fill(MOCK_WEATHER)
        .map((w, i) => ({
          ...w,
          dt_txt: new Date(Date.now() + i * 10800000).toISOString()
        }))
    };
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast by location:", error);
    throw error;
  }
};

// AIR QUALITY (Direct OpenWeather API)
export const fetchAirQuality = async (lat, lon) => {
  if (!API_KEY) {
    return {
      list: [
        {
          main: { aqi: 2 },
          components: {
            pm2_5: 12,
            pm10: 20,
            co: 200,
            no2: 15
          }
        }
      ]
    };
  }

  try {
    const response = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching AQI:", error);
    throw error;
  }
};