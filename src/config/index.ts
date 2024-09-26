const config = {
  auth: {
    cookieName: 'userAuth',
    saltRounds: 10,
  },
  log: {
    level: 'trace',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    maxTokens: process.env.OPENAI_MAX_TOKENS || 4096,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini-2024-07-18',
  },
  prompts: {
    // This tell the Prompts to use fake responses rather than
    // connecting with the AI. Useful for dev/testing purposes.
    // defaults to false, set to 'true' to override
    useFakeResponses: process.env.PROMPTS_USE_FAKE_RESPONSES,
  },
};

export default config;
