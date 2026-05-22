/**
 * Reusable utility to compute AQI statuses and health recommendations.
 */

export const calculateUSValueFromPM25 = (pm25) => {
  if (!pm25) return null;
  
  // Standard US EPA PM2.5 AQI breakpoints:
  // Conc (C) | AQI
  // 0.0 – 12.0 | 0 – 50
  // 12.1 – 35.4 | 51 – 100
  // 35.5 – 55.4 | 101 – 150
  // 55.5 – 150.4 | 151 – 200
  // 150.5 – 250.4 | 201 – 300
  // 250.5 – 500.4 | 301 – 500
  
  const calcAQI = (Cp, Ih, Il, BPh, BPl) => {
    return Math.round(((Ih - Il) / (BPh - BPl)) * (Cp - BPl) + Il);
  };

  if (pm25 <= 12.0) return calcAQI(pm25, 50, 0, 12.0, 0);
  if (pm25 <= 35.4) return calcAQI(pm25, 100, 51, 35.4, 12.1);
  if (pm25 <= 55.4) return calcAQI(pm25, 150, 101, 55.4, 35.5);
  if (pm25 <= 150.4) return calcAQI(pm25, 200, 151, 150.4, 55.5);
  if (pm25 <= 250.4) return calcAQI(pm25, 300, 201, 250.4, 150.5);
  if (pm25 <= 500.4) return calcAQI(pm25, 500, 301, 500.4, 250.5);
  return 500;
};

export const getAQIStatus = (aqiInput, components = null) => {
  let index = 1;
  let value = null;

  // 1. If it's a number, determine if it's index (1-5) or standard AQI value (0-500)
  if (typeof aqiInput === 'number') {
    if (aqiInput >= 1 && aqiInput <= 5) {
      index = aqiInput;
      // If pollutants are provided, calculate exact value from PM2.5
      if (components?.pm2_5) {
        value = calculateUSValueFromPM25(components.pm2_5);
      } else {
        // Fallback mapped values
        const defaultValues = { 1: 25, 2: 78, 3: 128, 4: 178, 5: 278 };
        value = defaultValues[index];
      }
    } else {
      value = Math.round(aqiInput);
      if (value <= 50) index = 1;
      else if (value <= 100) index = 2;
      else if (value <= 150) index = 3;
      else if (value <= 200) index = 4;
      else index = 5;
    }
  } else if (aqiInput && typeof aqiInput === 'object') {
    // Standard optional chaining extraction
    const rawAqi = aqiInput?.list?.[0]?.main?.aqi;
    const comps = aqiInput?.list?.[0]?.components;
    return getAQIStatus(rawAqi, comps);
  }

  // 2. Build status object based on the 1-5 index
  const statusDetails = {
    1: {
      index: 1,
      label: 'Good',
      readableLabel: 'Good Air Quality',
      color: 'text-green-400',
      bg: 'bg-green-400/20',
      border: 'border-green-500/30',
      barColor: 'bg-green-500',
      hex: '#22c55e',
      badgeBg: 'bg-green-500/10',
      recommendation: 'Air quality is healthy and safe.'
    },
    2: {
      index: 2,
      label: 'Fair',
      readableLabel: 'Fair Air Quality',
      color: 'text-lime-400',
      bg: 'bg-lime-400/20',
      border: 'border-lime-500/30',
      barColor: 'bg-lime-400',
      hex: '#84cc16',
      badgeBg: 'bg-lime-500/10',
      recommendation: 'Acceptable air quality for most people.'
    },
    3: {
      index: 3,
      label: 'Moderate',
      readableLabel: 'Moderate Air Quality',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/20',
      border: 'border-yellow-500/30',
      barColor: 'bg-yellow-500',
      hex: '#eab308',
      badgeBg: 'bg-yellow-500/10',
      recommendation: 'Sensitive individuals should reduce outdoor activity.'
    },
    4: {
      index: 4,
      label: 'Poor',
      readableLabel: 'Poor Air Quality',
      color: 'text-orange-400',
      bg: 'bg-orange-400/20',
      border: 'border-orange-500/30',
      barColor: 'bg-orange-500',
      hex: '#f97316',
      badgeBg: 'bg-orange-500/10',
      recommendation: 'Wear a mask and avoid prolonged outdoor exposure.'
    },
    5: {
      index: 5,
      label: 'Very Poor',
      readableLabel: 'Very Poor Air Quality',
      color: 'text-red-400',
      bg: 'bg-red-400/20',
      border: 'border-red-500/30',
      barColor: 'bg-red-500',
      hex: '#ef4444',
      badgeBg: 'bg-red-500/10',
      recommendation: 'Stay indoors and use air purification if possible.'
    }
  };

  const status = {
    ...statusDetails[index],
    value: value || 25
  };

  return status;
};
