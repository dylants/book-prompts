import config from '@/config/index';
import logger from '@/lib/logger';
import Prompt from '@/types/Prompt';

export default abstract class BasePrompt<Result> implements Prompt<Result> {
  abstract getSystemPrompt(): string;

  abstract getUserPrompt(): string;

  abstract execute(): Promise<Result | string>;

  logPrompts(): void {
    console.log(this.getSystemPrompt());
    console.log(this.getUserPrompt());
  }

  protected shouldUseFakeResponses(): boolean {
    const useFakeResponses: boolean =
      config.prompts.useFakeResponses === 'true';

    logger.trace({ useFakeResponses }, 'shouldUseFakeResponses');

    return useFakeResponses;
  }
}
