import { ZodType } from 'zod';

type Prompt = {
  getSystemPrompt(): string;
  getUserPrompt(): string;
  getSchema(): ZodType;
  logPrompts(): void;
};

export default Prompt;
