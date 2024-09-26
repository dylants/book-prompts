import { POST } from '@/app/api/protected/recommendations/route';
import projectConfig from '@/config/index';
import { fakeRecommendation } from '@/lib/fakes/recommendation.fake';
import prisma from '@/lib/prisma';
import bookRecommendationsSchema from '@/lib/schemas/book-recommendations.schema';
import aiService from '@/lib/services/ai.service';
import { NextRequest } from 'next/server';
import { ParsedChatCompletion } from 'openai/resources/beta/chat/completions';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { ZodType } from 'zod';
import bookReviewFixtures from '../fixtures/book-review.fixture';

const mockCreateMessage = jest.spyOn(aiService, 'createMessage');

describe('Recommend Books Integration Test', () => {
  let request: NextRequest;

  beforeEach(async () => {
    const user = await prisma.user.findFirstOrThrow();
    request = new NextRequest('http://localhost');
    request.cookies.set(projectConfig.auth.cookieName, user.uuid);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('when the AI returns a list of books', () => {
    const recommendations = [fakeRecommendation(), fakeRecommendation()];
    let receivedMessages: ChatCompletionMessageParam[], receivedSchema: ZodType;

    beforeEach(async () => {
      mockCreateMessage.mockImplementation(({ messages, schema }) => {
        receivedMessages = messages;
        receivedSchema = schema;
        return Promise.resolve({
          choices: [
            {
              message: {
                parsed: { recommendations },
                refusal: null,
              },
            },
          ],
        } as ParsedChatCompletion<unknown>);
      });
    });

    it('should query AI and respond with a list of recommendations', async () => {
      const response = await POST(request);

      expect(mockCreateMessage).toHaveBeenCalledTimes(1);
      expect(receivedMessages).toEqual([
        { content: expect.stringContaining('IDENTITY'), role: 'system' },
        { content: expect.stringContaining('OBJECTIVE'), role: 'user' },
      ]);
      expect(receivedSchema).toEqual(bookRecommendationsSchema);

      const userPrompt = receivedMessages[1].content;
      expect(userPrompt).toEqual(
        expect.stringContaining(`
- Recommend and return only 5 books
- The books should all feature witches (but not necessarily in the title).
- The books should be all in the Romantic genre.
- The books should be all in the Comedy subgenre.
`),
      );
      expect(userPrompt).toEqual(
        expect.stringContaining(
          `Previously read books: ${JSON.stringify(bookReviewFixtures)}`,
        ),
      );

      expect(response.status).toEqual(200);
      const body = await response.json();
      expect(body).toEqual({ data: recommendations });
    });
  });

  describe('when the AI refuses', () => {
    beforeEach(() => {
      mockCreateMessage.mockResolvedValue({
        choices: [
          {
            message: {
              refusal: 'I refuse!',
            },
          },
        ],
      } as ParsedChatCompletion<unknown>);
    });

    it('should return an error', async () => {
      const response = await POST(request);

      expect(mockCreateMessage).toHaveBeenCalledTimes(1);

      expect(response.status).toEqual(500);
      const body = await response.json();
      expect(body).toEqual({ error: 'Error occurred in prompt' });
    });
  });

  describe('when the AI fails', () => {
    beforeEach(() => {
      mockCreateMessage.mockResolvedValue({
        choices: [
          {
            message: {},
          },
        ],
      } as ParsedChatCompletion<unknown>);
    });

    it('should return an error', async () => {
      const response = await POST(request);

      expect(mockCreateMessage).toHaveBeenCalledTimes(1);

      expect(response.status).toEqual(500);
      const body = await response.json();
      expect(body).toEqual({ error: 'Error occurred in prompt' });
    });
  });
});
