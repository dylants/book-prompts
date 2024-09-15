const config = {
  auth: {
    // All /api routes are secured by checking for the auth token.
    // When the AUTH_TOKEN value is set, compares the requests to
    // verify they include this header key/value pair. Otherwise
    // will return 401, Unauthorized.
    token: {
      name: 'AUTH_TOKEN',
      value: process.env.AUTH_TOKEN,
    },
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
