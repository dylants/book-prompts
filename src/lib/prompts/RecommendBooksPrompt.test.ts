import config from '@/config/index';
import RecommendBooksPrompt from '@/lib/prompts/RecommendBooksPrompt';
import aiService from '@/lib/services/ai.service';
import User from '@/types/User';
import _ from 'lodash';

const mockCreateMessage = jest.spyOn(aiService, 'createMessage');

describe('RecommendBooksPrompt', () => {
  let originalConfig: { useFakeResponses: string | undefined };
  let prompt: RecommendBooksPrompt;

  beforeAll(() => {
    originalConfig = _.cloneDeep(config.prompts);
  });

  afterAll(() => {
    config.prompts = originalConfig;
  });

  beforeEach(() => {
    prompt = new RecommendBooksPrompt({ promptText: '', user: {} as User });
  });

  describe('when shouldUseFakeResponses is enabled', () => {
    beforeEach(() => {
      config.prompts.useFakeResponses = 'true';
    });

    it('should return the fake responses, and NOT call AI', async () => {
      const response = await prompt.execute();

      expect(mockCreateMessage).not.toHaveBeenCalled();
      expect(response.length).toEqual(5);
    });
  });
});
