// ==========================================
// 1. Multilingual Intent & Topic Detection
// ==========================================
export const detectUserIntent = (query) => {
  const lowerQuery = query.toLowerCase().trim();

  // Future / Forecast Keywords
  const futureKeywords = [
    'tomorrow', 'kal', 'next day', 'next week', 'forecast', 'future', 'upcoming',
    'hourly', 'weekly', 'parso', 'parson', 'agle hafte', 'agle din', 'predict',
    'prediction', 'outlook', 'trend', 'next', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'weekend', 'week', 'after tomorrow'
  ];

  // Check if any future keyword matches as a full word boundary
  const isFuture = futureKeywords.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(lowerQuery);
  });

  // Topic classification
  let topic = 'general';
  if (lowerQuery.includes('aqi') || lowerQuery.includes('air') || lowerQuery.includes('pollution') || lowerQuery.includes('smog') || lowerQuery.includes('haze') || lowerQuery.includes('hawa ki quality')) {
    topic = 'aqi';
  } else if (lowerQuery.includes('rain') || lowerQuery.includes('umbrella') || lowerQuery.includes('drizzle') || lowerQuery.includes('shower') || lowerQuery.includes('barish') || lowerQuery.includes('cloud') || lowerQuery.includes('clouds') || lowerQuery.includes('storm')) {
    topic = 'rain';
  } else if (lowerQuery.includes('temp') || lowerQuery.includes('temperature') || lowerQuery.includes('hot') || lowerQuery.includes('cold') || lowerQuery.includes('warm') || lowerQuery.includes('chilly') || lowerQuery.includes('heat') || lowerQuery.includes('taman') || lowerQuery.includes('garmi') || lowerQuery.includes('thand')) {
    topic = 'temperature';
  } else if (lowerQuery.includes('humidity') || lowerQuery.includes('humid') || lowerQuery.includes('moisture') || lowerQuery.includes('umas')) {
    topic = 'humidity';
  } else if (lowerQuery.includes('wind') || lowerQuery.includes('speed') || lowerQuery.includes('breeze') || lowerQuery.includes('hawa')) {
    topic = 'wind';
  } else if (lowerQuery.includes('tomorrow') || lowerQuery.includes('kal') || lowerQuery.includes('parso') || lowerQuery.includes('parson')) {
    topic = 'tomorrow';
  } else if (lowerQuery.includes('weekly') || lowerQuery.includes('week') || lowerQuery.includes('forecast') || lowerQuery.includes('agle hafte')) {
    topic = 'weekly';
  } else if (lowerQuery.includes('hourly') || lowerQuery.includes('hours') || lowerQuery.includes('hour')) {
    topic = 'hourly';
  } else if (lowerQuery.includes('current') || lowerQuery.includes('today') || lowerQuery.includes('now') || lowerQuery.includes('present') || lowerQuery.includes('aaj')) {
    topic = 'current';
  }

  return { isFuture, topic };
};

// ==========================================
// 2. Multilingual City Name Extractor
// ==========================================
export const extractCity = (query) => {
  const stopWords = new Set([
    'current', 'weather', 'tomorrow', 'weekly', 'hourly', 'forecast', 'aqi', 'rain', 'chances',
    'temperature', 'humidity', 'wind', 'speed', 'mausam', 'kal', 'ka', 'ki', 'ko', 'hogi', 'hoga',
    'in', 'at', 'for', 'the', 'is', 'what', 'how', 'will', 'be', 'next', 'week', 'day', 'agle', 'hafte',
    'please', 'tell', 'me', 'about', 'show', 'of', 'on', 'to', 'with', 'and', 'or', 'a', 'an', 'are', 'you',
    'your', 'my', 'i', 'need', 'to', 'go', 'out', 'outside', 'can', 'should', 'wear', 'carry', 'umbrella',
    'mask', 'safe', 'good', 'bad', 'chahiye', 'kya', 'hai', 'batao', 'bataiye', 'aaj', 'today', 'now', 'present',
    'any', 'some', 'information', 'details', 'report', 'stats', 'data', 'temp', 'condition', 'conditions',
    'status', 'index', 'air', 'quality', 'pollution', 'smog', 'haze', 'cloud', 'clouds', 'cloudy', 'sunny',
    'sun', 'hot', 'cold', 'warm', 'chilly', 'freeze', 'freezing', 'snow', 'snowing', 'rainy', 'raining', 'drizzle',
    'shower', 'showers', 'storm', 'stormy', 'thunder', 'thunderstorm', 'windy', 'breeze', 'gale', 'humid',
    'chances?', 'rain?', 'aqi?', 'forecast?', 'weather?', 'temperature?', 'humidity?', 'speed?', 'hogi?', 'hoga?'
  ]);

  const cleanQuery = query.replace(/[?,.!/\\()]/g, ' ');
  const words = cleanQuery.split(/\s+/).filter(w => w.length > 2);

  for (const word of words) {
    const lowerWord = word.toLowerCase();
    if (!stopWords.has(lowerWord)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
  }
  return null;
};

// ==========================================
// 3. Meteorological Aggregation & Parsers
// ==========================================
export const getTomorrowForecast = (forecastList) => {
  if (!forecastList || !Array.isArray(forecastList) || forecastList.length === 0) return null;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const tomorrowItems = forecastList.filter(item => {
    if (!item.dt_txt) return false;
    return item.dt_txt.startsWith(tomorrowStr);
  });

  const items = tomorrowItems.length > 0 ? tomorrowItems : forecastList.slice(8, 16);
  if (items.length === 0) return null;

  let minTemp = Infinity;
  let maxTemp = -Infinity;
  const conditionsCount = {};
  let totalHumidity = 0;
  let totalWind = 0;
  let rainProbabilityCount = 0;
  let totalPop = 0;

  items.forEach(item => {
    const temp = item.main.temp;
    if (temp < minTemp) minTemp = temp;
    if (temp > maxTemp) maxTemp = temp;

    const cond = item.weather[0].main;
    conditionsCount[cond] = (conditionsCount[cond] || 0) + 1;

    totalHumidity += item.main.humidity;
    totalWind += item.wind.speed;

    if (item.pop !== undefined) {
      totalPop += item.pop;
      rainProbabilityCount++;
    }
  });

  let dominantCondition = items[0].weather[0].description;
  let maxCount = 0;
  Object.keys(conditionsCount).forEach(cond => {
    if (conditionsCount[cond] > maxCount) {
      maxCount = conditionsCount[cond];
      const match = items.find(item => item.weather[0].main === cond);
      if (match) dominantCondition = match.weather[0].description;
    }
  });

  return {
    tempMin: Math.round(minTemp),
    tempMax: Math.round(maxTemp),
    condition: dominantCondition,
    humidity: Math.round(totalHumidity / items.length),
    windSpeed: Math.round((totalWind / items.length) * 10) / 10,
    rainChance: rainProbabilityCount > 0 ? Math.round((totalPop / rainProbabilityCount) * 100) : 0
  };
};

export const getWeeklyForecast = (forecastList) => {
  if (!forecastList || !Array.isArray(forecastList) || forecastList.length === 0) return null;

  const dailyGroups = {};
  forecastList.forEach(item => {
    if (!item.dt_txt) return;
    const dateStr = item.dt_txt.split(' ')[0];
    if (!dailyGroups[dateStr]) {
      dailyGroups[dateStr] = [];
    }
    dailyGroups[dateStr].push(item);
  });

  const dailySummary = [];
  Object.keys(dailyGroups).forEach(dateStr => {
    const items = dailyGroups[dateStr];
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    const conditions = {};

    items.forEach(item => {
      if (item.main.temp < minTemp) minTemp = item.main.temp;
      if (item.main.temp > maxTemp) maxTemp = item.main.temp;
      const cond = item.weather[0].main;
      conditions[cond] = (conditions[cond] || 0) + 1;
    });

    let dominantCondition = items[0].weather[0].description;
    let maxCount = 0;
    Object.keys(conditions).forEach(cond => {
      if (conditions[cond] > maxCount) {
        maxCount = conditions[cond];
        const match = items.find(item => item.weather[0].main === cond);
        if (match) dominantCondition = match.weather[0].description;
      }
    });

    const dateObj = new Date(dateStr);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    dailySummary.push({
      date: dateStr,
      day: dayName,
      tempMin: Math.round(minTemp),
      tempMax: Math.round(maxTemp),
      condition: dominantCondition
    });
  });

  return dailySummary;
};

export const getHourlyForecast = (forecastList) => {
  if (!forecastList || !Array.isArray(forecastList) || forecastList.length === 0) return null;

  return forecastList.slice(0, 8).map(item => {
    const dateObj = new Date(item.dt_txt);
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    return {
      time: timeStr,
      temp: Math.round(item.main.temp),
      condition: item.weather[0].description,
      rainChance: item.pop !== undefined ? Math.round(item.pop * 100) : 0
    };
  });
};

export const getAQISummary = (airQualityData) => {
  if (!airQualityData) return null;
  const rawAqi = airQualityData?.list?.[0]?.main?.aqi;
  const pm2_5 = airQualityData?.list?.[0]?.components?.pm2_5;
  const pm10 = airQualityData?.list?.[0]?.components?.pm10;

  let label = 'Unknown';
  let suggestion = 'No precautions necessary.';

  if (rawAqi === 1) {
    label = 'Good';
    suggestion = 'Air quality is safe. Perfect time for outdoor activities.';
  } else if (rawAqi === 2) {
    label = 'Fair';
    suggestion = 'Air quality is acceptable. Extremely sensitive groups should monitor symptoms.';
  } else if (rawAqi === 3) {
    label = 'Moderate';
    suggestion = 'Moderate pollution. Sensitive groups should reduce strenuous outdoor activity.';
  } else if (rawAqi === 4) {
    label = 'Poor';
    suggestion = 'AQI is Poor. Wearing a mask outdoors is highly recommended.';
  } else if (rawAqi === 5) {
    label = 'Very Poor';
    suggestion = 'Severe air pollution. Avoid outdoor exposure, stay indoors with filters active.';
  }

  return {
    aqiValue: rawAqi,
    label,
    suggestion,
    pm2_5: pm2_5 !== undefined ? Math.round(pm2_5) : 'unknown',
    pm10: pm10 !== undefined ? Math.round(pm10) : 'unknown'
  };
};

export const fallbackLogic = (query, weatherData, airQualityData, forecastData, intent) => {
  const city = weatherData?.name || 'this city';
  const aqiObj = getAQISummary(airQualityData);
  const aqiText = aqiObj ? `AQI is expected to remain in the ${aqiObj.label} category` : '';
  const isHinglish = /kal|mausam|hogi|hoga|kaisa|kya|batao|taapman|garmi|thand|baarish|baaris|agle/i.test(query.toLowerCase());

  const currentTemp = weatherData?.main?.temp !== undefined ? Math.round(weatherData.main.temp) : 22;
  const currentCond = weatherData?.weather?.[0]?.description || 'clear sky';
  
  const safetyTips = {
    heat: "Wearing loose clothing and drinking plenty of fluids is highly recommended.",
    rain: "Carrying an umbrella or a rain jacket is recommended if you are heading out.",
    aqi: aqiObj && aqiObj.aqiValue >= 4 ? "Wearing a protective N95 mask outdoors is strongly recommended." : "Perfect day to step out and enjoy some clean outdoor activities.",
    cold: "Wearing a warm jacket or dressing in layers is recommended.",
    general: "Please plan your activities accordingly and stay safe."
  };

  const safetyTipsHinglish = {
    heat: "Halki aur aaramdayak clothing pehenna aur paani peete rehna behtar hoga.",
    rain: "Bahar nikalte samay umbrella ya raincoat sath rakhna recommended hai.",
    aqi: aqiObj && aqiObj.aqiValue >= 4 ? "Bahar nikalte samay face mask pehanna bahut zaroori hai." : "Aaj ka mausam bahar ghumne ke liye behtar hai.",
    cold: "Garam kapde pehenna aur khud ko dhaanp kar rakhna safe rahega.",
    general: "Mausam ke anusaar apna plan banayein aur surakshit rahein."
  };

  const getTip = (type, condText, tempVal) => {
    const list = isHinglish ? safetyTipsHinglish : safetyTips;
    if (type === 'aqi' || aqiObj?.aqiValue >= 4) return list.aqi;
    if (condText.includes('rain') || condText.includes('drizzle') || condText.includes('shower') || condText.includes('thunderstorm')) return list.rain;
    if (tempVal > 32) return list.heat;
    if (tempVal < 15) return list.cold;
    return list.general;
  };

  if (intent.isFuture) {
    const tomorrowObj = getTomorrowForecast(forecastData?.list);
    if (!tomorrowObj) {
      return "Forecast data is currently unavailable. Please try again later.";
    }

    const cond = tomorrowObj.condition.toLowerCase();
    const tip = getTip(intent.topic, cond, tomorrowObj.tempMax);

    if (isHinglish) {
      if (intent.topic === 'aqi') {
        const aqiVal = aqiObj ? aqiObj.aqiValue : 'moderate';
        const aqiLabel = aqiObj ? aqiObj.label : 'Normal';
        return `Kal ${city} mein AQI ${aqiLabel} category (AQI: ${aqiVal}) mein rehne ki ummeed hai. ${tip}`;
      }
      if (intent.topic === 'rain') {
        return `Kal ${city} mein rain hone ke chances ${tomorrowObj.rainChance}% hain, aur taapman ${tomorrowObj.tempMin}°C se ${tomorrowObj.tempMax}°C ke beige rahega. ${tip}`;
      }
      return `Kal ${city} ka mausam expectedly '${tomorrowObj.condition}' rahega aur taapman ${tomorrowObj.tempMin}°C se ${tomorrowObj.tempMax}°C ke beech rahega. ${aqiText ? 'AQI ' + aqiObj.label + ' reh sakta hai. ' : ''}${tip}`;
    } else {
      if (intent.topic === 'aqi') {
        const aqiVal = aqiObj ? aqiObj.aqiValue : 'moderate';
        const aqiLabel = aqiObj ? aqiObj.label : 'Moderate';
        return `Tomorrow in ${city}, the air quality index (AQI) is expected to remain in the ${aqiLabel} category (AQI: ${aqiVal}). ${tip}`;
      }
      if (intent.topic === 'rain') {
        return `Tomorrow in ${city} shows a ${tomorrowObj.rainChance}% probability of rain with expected temperatures between ${tomorrowObj.tempMin}°C and ${tomorrowObj.tempMax}°C. ${tip}`;
      }
      return `Tomorrow in ${city} is expected to remain ${tomorrowObj.condition} with temperatures between ${tomorrowObj.tempMin}°C and ${tomorrowObj.tempMax}°C. ${aqiText ? 'Skies will stay ' + tomorrowObj.condition + ', while ' + aqiText + '. ' : ''}${tip}`;
    }
  }

  const condText = currentCond.toLowerCase();
  const tip = getTip(intent.topic, condText, currentTemp);

  if (isHinglish) {
    if (intent.topic === 'aqi') {
      const aqiVal = aqiObj ? aqiObj.aqiValue : 'moderate';
      const aqiLabel = aqiObj ? aqiObj.label : 'Normal';
      return `${city} mein abhi AQI ${aqiLabel} (${aqiVal}) hai. ${tip}`;
    }
    if (intent.topic === 'rain') {
      const rainStatus = condText.includes('rain') ? 'baarish ho rahi hai' : 'baarish ke chances abhi nahi hain';
      return `${city} mein abhi ${rainStatus}. Taapman ${currentTemp}°C aur mausam '${currentCond}' hai. ${tip}`;
    }
    return `${city} mein abhi taapman ${currentTemp}°C hai aur mausam '${currentCond}' bana hua hai. ${aqiObj ? 'Air Quality index (AQI) abhi ' + aqiObj.label + ' hai. ' : ''}${tip}`;
  } else {
    if (intent.topic === 'aqi') {
      const aqiVal = aqiObj ? aqiObj.aqiValue : 'moderate';
      const aqiLabel = aqiObj ? aqiObj.label : 'Moderate';
      return `The current AQI in ${city} is ${aqiLabel} (AQI: ${aqiVal}). ${tip}`;
    }
    if (intent.topic === 'rain') {
      const rainStatus = condText.includes('rain') ? 'raining' : 'clear with no active precipitation';
      return `Currently in ${city}, it is ${rainStatus}. The temperature is ${currentTemp}°C under ${currentCond}. ${tip}`;
    }
    return `Right now in ${city}, conditions are ${currentCond} with a temperature of ${currentTemp}°C. ${aqiText ? 'The ' + aqiText + '. ' : ''}${tip}`;
  }
};

export const getSystemPrompt = (weatherData, airQualityData, forecastData, intent) => {
  const city = weatherData?.name || 'Unknown City';
  const currentTemp = weatherData?.main?.temp !== undefined ? `${Math.round(weatherData.main.temp)}°C` : 'unknown';
  const currentCond = weatherData?.weather?.[0]?.description || 'unknown';
  const currentHumidity = weatherData?.main?.humidity !== undefined ? `${weatherData.main.humidity}%` : 'unknown';
  const currentWind = weatherData?.wind?.speed !== undefined ? `${weatherData.wind.speed} m/s` : 'unknown';

  const aqiObj = getAQISummary(airQualityData);
  const aqiSummary = aqiObj ? `${aqiObj.label} (AQI: ${aqiObj.aqiValue})` : 'unavailable';

  const tomorrowObj = getTomorrowForecast(forecastData?.list);
  const tomorrowText = tomorrowObj
    ? `Temperatures between ${tomorrowObj.tempMin}°C and ${tomorrowObj.tempMax}°C, Condition: ${tomorrowObj.condition}, Humidity: ${tomorrowObj.humidity}%, Wind: ${tomorrowObj.windSpeed} m/s, Rain probability: ${tomorrowObj.rainChance}%`
    : 'unavailable';

  const weeklyList = getWeeklyForecast(forecastData?.list);
  const weeklyText = weeklyList
    ? weeklyList.map(w => `${w.day}: ${w.tempMin}°C to ${w.tempMax}°C (${w.condition})`).join(', ')
    : 'unavailable';

  const hourlyList = getHourlyForecast(forecastData?.list);
  const hourlyText = hourlyList
    ? hourlyList.map(h => `${h.time}: ${h.temp}°C (${h.condition})`).join(', ')
    : 'unavailable';

  return `You are AtmosIQ, an adaptive climate intelligence AI.

Current Context:
- Active Location (City): ${city}
- Present Telemetry: Temperature: ${currentTemp}, Condition: ${currentCond}, Humidity: ${currentHumidity}, Wind: ${currentWind}, AQI: ${aqiSummary}

Forecast Context (Use ONLY for future or trend queries):
- Tomorrow's Forecast: ${tomorrowText}
- Weekly Forecast (5-day): ${weeklyText}
- Hourly Forecast (next 24h): ${hourlyText}

USER INTENT INFORMATION:
- Detected Query Topic: ${intent.topic}
- Is Future Query: ${intent.isFuture}

CORE BEHAVIOR RULES & ADAPTATION LOGIC:
1. Dynamic Response Adaptation:
   - Simple Queries (e.g., "what's the weather", "temperature?", "will it rain?"): Return a short, natural answer (1-2 sentences) with a quick practical suggestion. No visual reports or complex cards.
   - Moderate Queries (e.g., "AQI safe?", "best time to travel?", "outdoor activities?"): Return a concise advisory with specific health or travel guidance. Keep it focused and natural.
   - Advanced Analytical Queries (e.g., "Tokyo rain trend tomorrow", "compare cities", "show weather trend"): Return a structured, detailed analysis, highlighting specific climate intelligence trends.
   - Emergency/Severe Conditions (e.g., thunderstorms, heatwaves, extreme wind, hazardous AQI, flood risks): Deliver clear warnings/alerts immediately, with prominent safety recommendations and visual emphasis.

2. Visual Formatting Directives:
   - Do NOT suggest full reports, dashboards, or complex cards for every query.
   - Suggest charts, cards, or graphical trends ONLY when:
     * The user explicitly asks for trends, analysis, or comparisons.
     * Severe weather conditions are active (alert state).
     * AQI is dangerous (AQI >= 4).
     * Rainfall probability is significant (>60%).
   - Otherwise, stick to clean, natural text.

3. Communication Style & Tone:
   - Be intelligent, modern, natural, and adaptive. Avoid robotic telemetry spam like "Atmospheric Directive Matrix" or "Solar Emission Nominal".
   - DO NOT use markdown formatting codes like bolding (**) or italics (*). Keep the text absolutely clean (no asterisks) because it is used directly in speech synthesis and raw CLI interfaces.
   - Detect multilingual queries, particularly Hindi + English mixed language (Hinglish), and respond in a matching natural multilingual style (Hinglish or simple conversational English).

RESPONSE EXAMPLES:
- User: "tomorrow weather in Delhi"
  Response: "Delhi tomorrow will remain hot and sunny with temperatures ranging from 30°C to 41°C. The air quality index is expected to stay in the Poor category, so wearing a face mask outdoors is highly recommended."
- User: "kal ka mausam kaisa rahega?"
  Response: "Kal Delhi mein mausam saaf rahega aur taapman 30°C se 41°C ke beech rahega. AQI Poor category mein reh sakta hai, isliye bahar nikalte samay mask pehanna behtar hoga."
`;
};
