export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  LOCAL: 'local'
};

export const MODEL_CONFIGS = [
  {
    id: 'gemini-2.5-flash',
    name: 'gemini-2.5-flash',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) =>
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    timeout: 8000,
    priority: 1
  },

  {
    id: 'gemini-2.5-flash-lite',
    name: 'gemini-2.5-flash-lite',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) =>
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`,
    timeout: 5000,
    priority: 2
  },

  {
    id: 'gemini-2.0-flash',
    name: 'gemini-2.0-flash',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) =>
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    timeout: 6000,
    priority: 3
  }
];

export const GLOBAL_AI_SETTINGS = {
  MAX_RETRIES: 1,
  ENABLE_FALLBACK: true,
  DEFAULT_PROVIDER: AI_PROVIDERS.GEMINI
};