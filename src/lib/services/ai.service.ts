import config from '@/config/index';
import logger from '@/lib/logger';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ZodType } from 'zod';

class AIService {
  private openai: OpenAI;
  private maxTokens: number;
  private model: string;

  constructor() {
    const {
      openai: { apiKey, maxTokens, model },
    } = config;
    this.openai = new OpenAI({ apiKey });
    this.maxTokens = Number(maxTokens);
    this.model = model;

    logger.trace({ maxTokens: this.maxTokens, model: this.model }, 'AIService');
  }

  async createMessage<ZodInput extends ZodType>({
    messages,
    schema,
  }: {
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    schema: ZodInput;
  }) {
    logger.trace(
      { maxTokens: this.maxTokens, model: this.model },
      'createMessage',
    );

    return this.openai.beta.chat.completions.parse({
      max_completion_tokens: this.maxTokens,
      messages,
      model: this.model,
      response_format: zodResponseFormat(schema, 'data'),
    });
  }
}

const aiService = new AIService();
export default aiService;
