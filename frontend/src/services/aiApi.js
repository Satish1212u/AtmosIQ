import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://atmosiq-18gz.onrender.com/api';

/**
 * Calls the secure backend AI gateway for AtmosIQ intelligence.
 * No API keys, direct LLM URLs, or client-side model names are exposed here.
 *
 * @param {string} prompt - User request/question
 * @param {object} weatherData - Active OWM weather telemetry
 * @param {object} airQualityData - Optional active OWM air quality telemetry
 * @param {object} forecastData - Optional active OWM daily/hourly forecast data
 * @returns {Promise<object>} response payload
 */
export const generateAIResponse = async (prompt, weatherData, airQualityData = null, forecastData = null) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/ai/chat`, {
      message: prompt,
      weatherData,
      airQualityData,
      forecastData
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    let friendlyMessage = "The AI assistant is temporarily unavailable. Please make sure the backend server is running on port 5000.";
    
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      console.error(`[AI GATEWAY FAILURE] Server responded with code ${status}:`, data);
      
      if (status === 413) {
        friendlyMessage = "The request was too large to process. Try asking a more specific question.";
      } else if (status === 429) {
        friendlyMessage = "You've sent too many messages. Please wait a moment before trying again.";
      } else if (status === 401 || status === 403) {
        friendlyMessage = "Authentication failed. Please refresh the page and try again.";
      } else if (data && data.message) {
        friendlyMessage = `Something went wrong: ${data.message}`;
      } else {
        friendlyMessage = `An unexpected error occurred (status ${status}). Please try again.`;
      }
    } else if (error.request) {
      console.error('[AI GATEWAY NO RESPONSE] No response received from server:', error.request);
      friendlyMessage = "Could not reach the AI server. Please check your connection and ensure the backend is running on port 5000.";
    } else {
      console.error('[AI GATEWAY CONFIG ERROR] Request setup failure:', error.message);
      friendlyMessage = `Something went wrong while connecting: ${error.message}`;
    }

    return {
      success: false,
      modelUsed: 'local-frontend-fallback',
      response: friendlyMessage,
      fallbackTriggered: true
    };
  }
};
