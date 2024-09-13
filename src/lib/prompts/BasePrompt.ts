import Prompt from '@/types/Prompt';

export default abstract class BasePrompt implements Prompt {
  abstract getSystemPrompt(): string;

  abstract getUserPrompt(): string;

  logPrompts(): void {
    console.log(this.getSystemPrompt());
    console.log(this.getUserPrompt());
  }
}
