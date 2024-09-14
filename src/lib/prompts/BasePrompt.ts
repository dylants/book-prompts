import Prompt from '@/types/Prompt';
import { ZodType } from 'zod';

export default abstract class BasePrompt implements Prompt {
  abstract getSystemPrompt(): string;

  abstract getUserPrompt(): string;

  abstract getSchema(): ZodType;

  logPrompts(): void {
    console.log(this.getSystemPrompt());
    console.log(this.getUserPrompt());
  }
}
