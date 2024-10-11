import config from '@/config/index';
import logger from '@/lib/logger';
import Prompt from '@/types/Prompt';

export default abstract class BasePrompt<Result> implements Prompt<Result> {
  abstract getSystemPrompt(): Promise<string>;

  abstract getUserPrompt(): Promise<string>;

  abstract execute(): Promise<Result | string>;

  async logPrompts(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(await this.getSystemPrompt());
    // eslint-disable-next-line no-console
    console.log(await this.getUserPrompt());
  }

  protected shouldUseFakeResponses(): boolean {
    const useFakeResponses: boolean =
      config.prompts.useFakeResponses === 'true';

    logger.trace({ useFakeResponses }, 'shouldUseFakeResponses');

    return useFakeResponses;
  }
}
