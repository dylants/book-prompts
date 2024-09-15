import { ZodType } from 'zod';

type Prompt<Result> = {
  getSystemPrompt(): string;
  getUserPrompt(): string;
  getSchema(): ZodType;
  logPrompts(): void;
  execute(): Promise<Result | string>;
};

export default Prompt;
