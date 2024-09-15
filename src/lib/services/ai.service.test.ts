import aiService from '@/lib/services/ai.service';
import { ParsedChatCompletion } from 'openai/resources/beta/chat/completions.mjs';
import { z } from 'zod';
import { openaiMock } from '../../../test-setup/openai-mock.setup';

jest.mock('@/config/index', () => ({
  openai: {
    maxTokens: 23,
    model: 'my-model',
  },
}));

describe('ai.service', () => {
  describe('createMessage', () => {
    it('should call openai', async () => {
      openaiMock.beta.chat.completions.parse.mockResolvedValue(
        'response' as unknown as ParsedChatCompletion<unknown>,
      );

      const response = await aiService.createMessage({
        messages: [{ content: 'hi', role: 'user' }],
        schema: z.string(),
      });

      expect(openaiMock.beta.chat.completions.parse).toHaveBeenCalledWith({
        max_completion_tokens: 23,
        messages: [{ content: 'hi', role: 'user' }],
        model: 'my-model',
        response_format: {
          json_schema: {
            name: 'data',
            schema: {
              $schema: 'http://json-schema.org/draft-07/schema#',
              type: 'string',
            },
            strict: true,
          },
          type: 'json_schema',
        },
      });
      expect(response).toEqual('response');
    });
  });
});
