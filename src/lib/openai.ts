import config from '@/config/index';
import OpenAI from 'openai';

const openaiSingleton = () => {
  const {
    openai: { apiKey },
  } = config;
  return new OpenAI({ apiKey });
};

declare const globalThis: {
  openaiGlobal: ReturnType<typeof openaiSingleton>;
} & typeof global;

const openai = globalThis.openaiGlobal ?? openaiSingleton();

export default openai;

if (process.env.NODE_ENV !== 'production') globalThis.openaiGlobal = openai;
