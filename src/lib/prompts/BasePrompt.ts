import Prompt from '@/types/Prompt';
import { ZodType } from 'zod';

export default abstract class BasePrompt<Result> implements Prompt<Result> {
  abstract getSystemPrompt(): string;

  abstract getUserPrompt(): string;

  abstract getSchema(): ZodType;

  abstract execute(): Promise<Result | string>;

  logPrompts(): void {
    console.log(this.getSystemPrompt());
    console.log(this.getUserPrompt());
  }
}
