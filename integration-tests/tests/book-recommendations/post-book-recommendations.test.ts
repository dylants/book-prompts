import {
  POST,
  PostResponseBody,
} from '@/app/api/protected/book-recommendations/route';
import projectConfig from '@/config/index';
import { fakeAIBookRecommendation } from '@/lib/fakes/recommendation.fake';
import { isbnHash } from '@/lib/hash';
import prisma from '@/lib/prisma';
import bookRecommendationsSchema from '@/lib/schemas/book-recommendations.schema';
import { GoogleSearchResponse } from '@/lib/search/google.search';
import aiService from '@/lib/services/ai.service';
import AIBookRecommendation from '@/types/AIBookRecommendation';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { NextRequest } from 'next/server';
import { ParsedChatCompletion } from 'openai/resources/beta/chat/completions';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { ZodType } from 'zod';
import {
  USER_NO_REVIEWS_EMAIL,
  USER_WITH_REVIEWS_EMAIL,
} from '../../fixtures/user.fixture';

const mockCreateMessage = jest.spyOn(aiService, 'createMessage');

const AUTHOR = 'post-rec-test author';
const FIRST_RECOMMENDATION: AIBookRecommendation = {
  ...fakeAIBookRecommendation(),
  author: AUTHOR,
  title: 'title1',
};
const SECOND_RECOMMENDATION: AIBookRecommendation = {
  ...fakeAIBookRecommendation(),
  author: AUTHOR,
  title: 'title2',
};
const RECOMMENDATIONS = [FIRST_RECOMMENDATION, SECOND_RECOMMENDATION];

const GOOGLE_BOOK_FOUND: GoogleSearchResponse = {
  items: [
    {
      volumeInfo: {
        authors: [FIRST_RECOMMENDATION.author],
        imageLinks: { thumbnail: 'http://image.com' },
        industryIdentifiers: [
          {
            identifier: '123',
            type: 'ISBN_13',
          },
        ],
        title: FIRST_RECOMMENDATION.title,
      },
    },
  ],
  totalItems: 1,
};
const GOOGLE_BOOK_NOT_FOUND: GoogleSearchResponse = {
  items: [],
  totalItems: 0,
};

describe('Recommend Books Integration Test', () => {
  let request: NextRequest;

  const server = setupServer(
    rest.get('https://www.googleapis.com/*', (req, res, ctx) => {
      if (req.url.search.includes('title1')) {
        return res(ctx.json(GOOGLE_BOOK_FOUND));
      } else {
        return res(ctx.json(GOOGLE_BOOK_NOT_FOUND));
      }
    }),
  );

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();

    jest.resetAllMocks();
  });

  afterAll(async () => {
    server.close();

    // delete all the books we created (which deletes the recommendations as well)
    await prisma.book.deleteMany({
      where: { author: AUTHOR },
    });
  });

  describe('when the user has book reviews', () => {
    let bookReviews: {
      book: { author: string; title: string };
      rating: number;
    }[];

    beforeAll(async () => {
      const user = await prisma.user.findFirstOrThrow({
        include: {
          bookReviews: {
            orderBy: { rating: 'desc' },
            select: {
              book: {
                select: {
                  author: true,
                  title: true,
                },
              },
              rating: true,
            },
          },
        },
        where: { email: USER_WITH_REVIEWS_EMAIL },
      });

      request = new NextRequest('http://localhost');
      request.cookies.set(projectConfig.auth.cookieName, user.uuid);

      bookReviews = user.bookReviews;
    });

    describe('when the AI returns a list of recommendations', () => {
      let receivedMessages: ChatCompletionMessageParam[],
        receivedSchema: ZodType;

      beforeEach(async () => {
        mockCreateMessage.mockImplementation(({ messages, schema }) => {
          receivedMessages = messages;
          receivedSchema = schema;
          return Promise.resolve({
            choices: [
              {
                message: {
                  parsed: { recommendations: RECOMMENDATIONS },
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
            `Previously read books: ${JSON.stringify(bookReviews)}`,
          ),
        );

        expect(response.status).toEqual(200);

        const { data } = (await response.json()) as PostResponseBody;
        expect(data.length).toEqual(2);

        const [actualFirstRecommendation, actualSecondRecommendation] = data;
        expect(actualFirstRecommendation).toEqual(
          expect.objectContaining({
            book: expect.objectContaining({
              author: FIRST_RECOMMENDATION.author,
              confirmedExists: true,
              imageUrl: 'https://image.com',
              isbn13: '123',
              title: FIRST_RECOMMENDATION.title,
            }),
            confidenceScore: FIRST_RECOMMENDATION.confidenceScore.toString(),
            explanation: FIRST_RECOMMENDATION.explanation,
          }),
        );
        expect(actualSecondRecommendation).toEqual(
          expect.objectContaining({
            book: expect.objectContaining({
              author: SECOND_RECOMMENDATION.author,
              confirmedExists: false,
              imageUrl: null,
              isbn13: isbnHash({
                author: SECOND_RECOMMENDATION.author,
                title: SECOND_RECOMMENDATION.title,
              }),
              title: SECOND_RECOMMENDATION.title,
            }),
            confidenceScore: SECOND_RECOMMENDATION.confidenceScore.toString(),
            explanation: SECOND_RECOMMENDATION.explanation,
          }),
        );
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
        expect(body).toEqual({ error: 'Unknown error' });
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
        expect(body).toEqual({ error: 'Unknown error' });
      });
    });
  });

  describe('when the user has no book reviews AND the AI responds with recommendations', () => {
    let receivedMessages: ChatCompletionMessageParam[];

    beforeAll(async () => {
      const user = await prisma.user.findFirstOrThrow({
        where: { email: USER_NO_REVIEWS_EMAIL },
      });

      request = new NextRequest('http://localhost');
      request.cookies.set(projectConfig.auth.cookieName, user.uuid);
    });

    beforeEach(async () => {
      mockCreateMessage.mockImplementation(({ messages }) => {
        receivedMessages = messages;
        return Promise.resolve({
          choices: [
            {
              message: {
                parsed: { recommendations: RECOMMENDATIONS },
                refusal: null,
              },
            },
          ],
        } as ParsedChatCompletion<unknown>);
      });
    });

    it('should provide the AI with no book reviews', async () => {
      const response = await POST(request);

      expect(mockCreateMessage).toHaveBeenCalledTimes(1);
      expect(receivedMessages).toEqual([
        { content: expect.stringContaining('IDENTITY'), role: 'system' },
        { content: expect.stringContaining('OBJECTIVE'), role: 'user' },
      ]);

      const userPrompt = receivedMessages[1].content;
      expect(userPrompt).toEqual(
        expect.stringContaining('Previously read books: []'),
      );

      expect(response.status).toEqual(200);

      const { data } = (await response.json()) as PostResponseBody;
      expect(data.length).toEqual(2);
    });
  });

  it('should fail when unauthorized', async () => {
    const request = new NextRequest('http://localhost');

    const response = await POST(request);

    expect(response.status).toEqual(401);
    expect(await response.json()).toEqual({
      error: 'Unauthorized',
    });
  });
});
