import axios from 'axios';

// Backend API URL
const API_URL = 'https://atmosiq-18gz.onrender.com';

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

// WEATHER
export const fetchWeather = async (city) => {

  try {

    const response = await axios.get(
      `${API_URL}/api/weather/${city}`
    );

    return response.data;

  } catch (error) {

    console.error('Error fetching weather:', error);

    return {
      ...MOCK_WEATHER,
      name: city || 'Mock City'
    };

  }

};

// FORECAST
export const fetchForecast = async (city) => {

  try {

    const response = await axios.get(
      `${API_URL}/api/forecast/${city}`
    );

    return response.data;

  } catch (error) {

    console.error('Error fetching forecast:', error);

    return {
      list: Array(40)
        .fill(MOCK_WEATHER)
        .map((w, i) => ({
          ...w,
          dt_txt: new Date(
            Date.now() + i * 10800000
          ).toISOString()
        }))
    };

  }

};

// WEATHER BY LOCATION
export const fetchWeatherByLocation = async (lat, lon) => {

  try {

    const response = await axios.get(
      `${API_URL}/api/weather/location`,
      {
        params: { lat, lon }
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      'Error fetching weather by location:',
      error
    );

    return {
      ...MOCK_WEATHER,
      name: 'Current Location'
    };

  }

};

// FORECAST BY LOCATION
export const fetchForecastByLocation = async (lat, lon) => {

  try {

    const response = await axios.get(
      `${API_URL}/api/forecast/location`,
      {
        params: { lat, lon }
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      'Error fetching forecast by location:',
      error
    );

    return {
      list: Array(40)
        .fill(MOCK_WEATHER)
        .map((w, i) => ({
          ...w,
          dt_txt: new Date(
            Date.now() + i * 10800000
          ).toISOString()
        }))
    };

  }

};

// AIR QUALITY
export const fetchAirQuality = async (lat, lon) => {

  try {

    const response = await axios.get(
      `${API_URL}/api/aqi`,
      {
        params: { lat, lon }
      }
    );

    return response.data;

  } catch (error) {

    console.error('Error fetching AQI:', error);

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

};