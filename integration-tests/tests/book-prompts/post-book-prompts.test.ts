import {
  POST,
  PostRequestBody,
  PostResponseBody,
} from '@/app/api/protected/book-prompts/route';
import { fakeAIBookRecommendation } from '@/lib/fakes/recommendation.fake';
import { isbnHash } from '@/lib/hash';
import prisma from '@/lib/prisma';
import bookRecommendationsSchema from '@/lib/schemas/book-recommendations.schema';
import { GoogleSearchResponse } from '@/lib/search/google.search';
import aiService from '@/lib/services/ai.service';
import AIBookRecommendation from '@/types/AIBookRecommendation';
import User from '@/types/User';
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
import { establishAuth } from '../../test-lib/auth';

const mockCreateMessage = jest.spyOn(aiService, 'createMessage');

const url = 'https://localhost';

const PROMPT_TEXT = 'post-book-prompt.test prompt text';
const BODY: PostRequestBody = {
  promptText: PROMPT_TEXT,
};

const AUTHOR = 'post-book-prompt.test author';
const FIRST_RECOMMENDATION: AIBookRecommendation = {
  ...fakeAIBookRecommendation(),
  authors: [AUTHOR],
  title: 'title1',
};
const SECOND_RECOMMENDATION: AIBookRecommendation = {
  ...fakeAIBookRecommendation(),
  authors: [AUTHOR],
  title: 'title2',
};
const RECOMMENDATIONS = [FIRST_RECOMMENDATION, SECOND_RECOMMENDATION];

const GOOGLE_BOOK_FOUND: GoogleSearchResponse = {
  items: [
    {
      volumeInfo: {
        authors: [AUTHOR],
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

describe('/api/protected/book-prompts POST Integration Test', () => {
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

  afterEach(async () => {
    server.resetHandlers();

    jest.resetAllMocks();

    // delete all the book prompts we created (which deletes the recommendations as well)
    await prisma.bookPrompt.deleteMany({
      where: { promptText: PROMPT_TEXT },
    });
    // delete all the books we created from those recommendations
    await prisma.book.deleteMany({
      where: { authors: { some: { name: AUTHOR } } },
    });
    // delete the author we created
    await prisma.author.deleteMany({
      where: { name: AUTHOR },
    });
  });

  afterAll(() => server.close());

  describe('when the user has book reviews', () => {
    let authorReviews: {
      author: { name: string };
      rating: number;
    }[];
    let bookReviews: {
      book: { authors: { name: string }[]; title: string };
      rating: number;
    }[];
    let user: User & {
      authorReviews: typeof authorReviews;
      bookReviews: typeof bookReviews;
    };

    beforeAll(async () => {
      user = await prisma.user.findFirstOrThrow({
        include: {
          authorReviews: {
            orderBy: { rating: 'desc' },
            select: {
              author: { select: { name: true } },
              rating: true,
            },
          },
          bookReviews: {
            orderBy: { rating: 'desc' },
            select: {
              book: {
                select: { authors: { select: { name: true } }, title: true },
              },
              rating: true,
            },
          },
        },
        where: { email: USER_WITH_REVIEWS_EMAIL },
      });

      bookReviews = user.bookReviews;
      authorReviews = user.authorReviews;
    });

    it('should fail when not passing correct data', async () => {
      const request = new NextRequest(url, {
        body: JSON.stringify({ foo: 'bar' }),
        method: 'POST',
      });
      establishAuth({ request, user });
      const response = await POST(request);

      expect(response.status).toEqual(400);
      expect(await response.json()).toEqual({
        error: 'Validation error: Required at "promptText"',
      });
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
        const request = new NextRequest(url, {
          body: JSON.stringify(BODY),
          method: 'POST',
        });
        establishAuth({ request, user });
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
- Recommend books that ${PROMPT_TEXT}.
`),
        );
        expect(userPrompt).toEqual(
          expect.stringContaining(
            `Previously read books: ${JSON.stringify(bookReviews)}`,
          ),
        );
        expect(userPrompt).toEqual(
          expect.stringContaining(
            `Previously read authors: ${JSON.stringify(authorReviews)}`,
          ),
        );

        expect(response.status).toEqual(200);

        const { data } = (await response.json()) as PostResponseBody;
        expect(data).toEqual(
          expect.objectContaining({
            promptText: PROMPT_TEXT,
          }),
        );

        const { bookRecommendations } = data;
        expect(bookRecommendations.length).toEqual(2);

        expect(bookRecommendations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              book: expect.objectContaining({
                authors: expect.arrayContaining([
                  expect.objectContaining({
                    name: AUTHOR,
                  }),
                ]),
                confirmedExists: true,
                imageUrl: 'https://image.com',
                isbn13: '123',
                title: FIRST_RECOMMENDATION.title,
              }),
              confidenceScore: FIRST_RECOMMENDATION.confidenceScore.toString(),
              explanation: FIRST_RECOMMENDATION.explanation,
            }),
            expect.objectContaining({
              book: expect.objectContaining({
                authors: expect.arrayContaining([
                  expect.objectContaining({
                    name: AUTHOR,
                  }),
                ]),
                confirmedExists: false,
                imageUrl: null,
                isbn13: isbnHash({
                  authors: SECOND_RECOMMENDATION.authors,
                  title: SECOND_RECOMMENDATION.title,
                }),
                title: SECOND_RECOMMENDATION.title,
              }),
              confidenceScore: SECOND_RECOMMENDATION.confidenceScore.toString(),
              explanation: SECOND_RECOMMENDATION.explanation,
            }),
          ]),
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
        const request = new NextRequest(url, {
          body: JSON.stringify(BODY),
          method: 'POST',
        });
        establishAuth({ request, user });
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
        const request = new NextRequest(url, {
          body: JSON.stringify(BODY),
          method: 'POST',
        });
        establishAuth({ request, user });
        const response = await POST(request);

        expect(mockCreateMessage).toHaveBeenCalledTimes(1);

        expect(response.status).toEqual(500);
        const body = await response.json();
        expect(body).toEqual({ error: 'Unknown error' });
      });
    });
  });

  describe('when the user has no book reviews AND the AI responds with recommendations', () => {
    let user: User;
    let receivedMessages: ChatCompletionMessageParam[];

    beforeAll(async () => {
      user = await prisma.user.findFirstOrThrow({
        where: { email: USER_NO_REVIEWS_EMAIL },
      });
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
      const request = new NextRequest(url, {
        body: JSON.stringify(BODY),
        method: 'POST',
      });
      establishAuth({ request, user });
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
