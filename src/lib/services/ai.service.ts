import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { ZodType } from 'zod';

const DEFAULT_MODEL = 'gpt-4o-mini-2024-07-18';

class AIService {
  private openai: OpenAI;
  private model: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
    // TODO logger
    console.log(this.model);
  }

  async createMessage({
    messages,
    schema,
  }: {
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
    schema: ZodType;
  }) {
    return this.openai.beta.chat.completions.parse({
      max_completion_tokens: 4096,
      messages,
      model: this.model,
      response_format: zodResponseFormat(schema, 'data'),
    });
  }
}

const aiService = new AIService();
export default aiService;
