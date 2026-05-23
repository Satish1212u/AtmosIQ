export const MODEL_CONFIGS = [
  {
    id: 'gemini-2.0-flash',
    name: 'gemini-2.0-flash',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) =>
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    timeout: 6000,
    priority: 1
  },
  {
    id: 'gemini-2.0-flash-lite',
    name: 'gemini-2.0-flash-lite',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) =>
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${key}`,
    timeout: 5000,
    priority: 2
  }
];