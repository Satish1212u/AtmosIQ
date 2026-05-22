export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  LOCAL: 'local'
};

export const MODEL_CONFIGS = [
  {
    id: 'gemini-2.0-flash',
    name: 'gemini-2.0-flash',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    timeout: 6000,
    priority: 1
  },
  {
    id: 'gemini-1.5-flash',
    name: 'gemini-1.5-flash',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    timeout: 6000,
    priority: 2
  },
  {
    id: 'gemini-1.5-pro',
    name: 'gemini-1.5-pro',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${key}`,
    timeout: 8000, // Pro models can take slightly longer to process complex payloads
    priority: 3
  }
];

export const GLOBAL_AI_SETTINGS = {
  overallTimeout: 20000,
  fallbackToLocal: true
};
