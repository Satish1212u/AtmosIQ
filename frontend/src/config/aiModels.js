export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  OPENAI: 'openai',
  CLAUDE: 'claude',
  GROQ: 'groq',
  DEEPSEEK: 'deepseek',
  LOCAL: 'local'
};

export const MODEL_CONFIGS = [
  {
    id: 'gemini-2.5-flash',
    name: 'gemini-2.5-flash',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    timeout: 6000, // 6 seconds timeout per attempt
    priority: 1
  },
  {
    id: 'gemini-2.0-flash',
    name: 'gemini-2.0-flash',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    timeout: 6000, // 6 seconds timeout per attempt
    priority: 2
  },
  {
    id: 'gemini-flash-latest',
    name: 'gemini-flash-latest',
    provider: AI_PROVIDERS.GEMINI,
    endpoint: (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${key}`,
    timeout: 6000, // 6 seconds timeout per attempt
    priority: 3
  }
];

export const GLOBAL_AI_SETTINGS = {
  overallTimeout: 20000, // Overall max time for fallback chaining
  fallbackToLocal: true
};
