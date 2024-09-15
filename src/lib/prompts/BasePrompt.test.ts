import config from '@/config/index';
import BasePrompt from '@/lib/prompts/BasePrompt';
import _ from 'lodash';
import { z, ZodType } from 'zod';

const log = jest.spyOn(console, 'log').mockImplementation(() => {});

class TestPrompt extends BasePrompt<string> {
  getSystemPrompt(): string {
    return 'system prompt';
  }

  getUserPrompt(): string {
    return 'user prompt';
  }

  getSchema(): ZodType {
    return z.object({});
  }

  execute(): Promise<string> {
    return Promise.resolve('execute');
  }

  testShouldUseFakeResponses(): boolean {
    return this.shouldUseFakeResponses();
  }
}

describe('BasePrompt', () => {
  let originalConfig: { useFakeResponses: string | undefined };
  let testPrompt: TestPrompt;

  beforeAll(() => {
    originalConfig = _.cloneDeep(config.prompts);
  });

  beforeEach(() => {
    testPrompt = new TestPrompt();
  });

  afterAll(() => {
    config.prompts = originalConfig;
    log.mockReset();
  });

  describe('logPrompts', () => {
    it('should log the prompts', () => {
      testPrompt.logPrompts();

      expect(log).toHaveBeenCalledTimes(2);
      expect(log).toHaveBeenNthCalledWith(1, 'system prompt');
      expect(log).toHaveBeenNthCalledWith(2, 'user prompt');
    });
  });

  describe('shouldUseFakeResponses', () => {
    it('should return false by default', () => {
      config.prompts.useFakeResponses = undefined;
      expect(testPrompt.testShouldUseFakeResponses()).toEqual(false);
    });

    it('should return true with override', () => {
      config.prompts.useFakeResponses = 'true';
      expect(testPrompt.testShouldUseFakeResponses()).toEqual(true);
    });

    it('should return false with invalid value', () => {
      config.prompts.useFakeResponses = 'bad';
      expect(testPrompt.testShouldUseFakeResponses()).toEqual(false);
    });
  });
});
