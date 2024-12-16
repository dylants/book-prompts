import config from '@/config/index';
import logger from '@/lib/logger';
import openai from '@/lib/openai';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ParsedChatCompletion } from 'openai/resources/beta/chat/completions.mjs';
import { TypeOf, ZodType } from 'zod';

class AIService {
  private maxTokens: number;
  private model: string;

  constructor() {
    const {
      openai: { maxTokens, model },
    } = config;
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
  }): Promise<ParsedChatCompletion<TypeOf<ZodInput>>> {
    logger.trace(
      { maxTokens: this.maxTokens, model: this.model },
      'createMessage',
    );

    return openai.beta.chat.completions.parse({
      max_completion_tokens: this.maxTokens,
      messages,
      model: this.model,
      response_format: zodResponseFormat(schema, 'data'),
    });
  }
}

const aiService = new AIService();
export default aiService;
