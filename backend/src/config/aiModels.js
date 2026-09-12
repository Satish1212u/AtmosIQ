export const AI_PROVIDERS = {
  GEMINI: 'gemini',
  OPENROUTER: 'openrouter',
  LOCAL: 'local'
};

/**
 * Gemini model cascade — tried in priority order.
 * Timeouts are strict per-provider; no global retry logic here.
 */
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

/**
 * OpenRouter secondary fallback configuration.
 * Triggered ONLY after ALL Gemini models fail with retriable errors.
 * Model name is read from process.env.OPENROUTER_MODEL at runtime.
 * API key is NEVER exposed to the frontend or printed in logs.
 */
export const OPENROUTER_CONFIG = {
  id: 'openrouter-fallback',
  provider: AI_PROVIDERS.OPENROUTER,
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  timeout: 12000,
  priority: 4,
  // Model name resolved at call-time from env; falls back to a known free model
  getModel: () => process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free'
};

export const GLOBAL_AI_SETTINGS = {
  ENABLE_FALLBACK: true,
  DEFAULT_PROVIDER: AI_PROVIDERS.GEMINI
};