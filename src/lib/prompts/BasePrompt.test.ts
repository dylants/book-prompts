import BasePrompt from '@/lib/prompts/BasePrompt';

const log = jest.spyOn(console, 'log').mockImplementation(() => {});

class TestPrompt extends BasePrompt<string> {
  getSystemPrompt(): Promise<string> {
    return Promise.resolve('system prompt');
  }

  getUserPrompt(): Promise<string> {
    return Promise.resolve('user prompt');
  }

  execute(): Promise<string> {
    return Promise.resolve('execute');
  }
}

describe('BasePrompt', () => {
  let testPrompt: TestPrompt;

  beforeEach(() => {
    testPrompt = new TestPrompt();
  });

  afterAll(() => {
    log.mockReset();
  });

  describe('logPrompts', () => {
    it('should log the prompts', async () => {
      await testPrompt.logPrompts();

      expect(log).toHaveBeenCalledTimes(2);
      expect(log).toHaveBeenNthCalledWith(1, 'system prompt');
      expect(log).toHaveBeenNthCalledWith(2, 'user prompt');
    });
  });
});
