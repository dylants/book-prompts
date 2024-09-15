const config = {
  log: {
    level: 'trace',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    maxTokens: process.env.OPENAI_MAX_TOKENS || 4096,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini-2024-07-18',
  },
};

export default config;
