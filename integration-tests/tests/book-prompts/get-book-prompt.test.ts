import {
  GET,
  GetResponseBody,
} from '@/app/api/protected/book-prompts/[bookPromptId]/route';
import prisma from '@/lib/prisma';
import BookPromptHydrated from '@/types/BookPromptHydrated';
import User from '@/types/User';
import { NextRequest } from 'next/server';
import {
  USER_WITH_ONE_REVIEW_EMAIL,
  USER_WITH_REVIEWS_EMAIL,
} from '../../fixtures/user.fixture';
import { establishAuth } from '../../test-lib/auth';

const url = 'https://localhost';

describe('/api/protected/book-prompts/[bookPromptId] GET Integration Test', () => {
  let user: User & { bookPrompts: BookPromptHydrated[] };
  let bookPrompt: BookPromptHydrated;

  beforeAll(async () => {
    user = await prisma.user.findFirstOrThrow({
      include: {
        bookPrompts: {
          include: {
            bookRecommendations: {
              include: {
                book: {
                  include: {
                    authors: true,
                  },
                },
              },
              omit: {
                bookId: true,
                bookPromptId: true,
              },
            },
          },
          omit: {
            aiModel: true,
            userId: true,
          },
        },
      },
      where: { email: USER_WITH_REVIEWS_EMAIL },
    });

    bookPrompt = user.bookPrompts[0];
  });

  describe('when the book prompt exists', () => {
    it('should return the book prompt', async () => {
      const request = new NextRequest(url);
      establishAuth({ request, user });
      const response = await GET(request, {
        params: { bookPromptId: String(bookPrompt.id) },
      });

      expect(response.status).toEqual(200);
      const { data } = (await response.json()) as GetResponseBody;

      expect(data).toEqual(JSON.parse(JSON.stringify(bookPrompt)));
    });
  });

  describe('when the book prompt does not exist', () => {
    it('should return not found', async () => {
      const request = new NextRequest(url);
      establishAuth({ request, user });
      const response = await GET(request, {
        params: { bookPromptId: '999999' },
      });

      expect(response.status).toEqual(404);
      expect(await response.json()).toEqual({
        error: 'Book prompt not found',
      });
    });
  });

  describe("when accessing another user's book prompt", () => {
    let otherUserBookPrompt: BookPromptHydrated;

    beforeAll(async () => {
      const otherUser = await prisma.user.findFirstOrThrow({
        include: {
          bookPrompts: {
            include: {
              bookRecommendations: {
                include: {
                  book: {
                    include: {
                      authors: true,
                    },
                  },
                },
                omit: {
                  bookId: true,
                  bookPromptId: true,
                },
              },
            },
            omit: {
              aiModel: true,
              userId: true,
            },
          },
        },
        where: { email: USER_WITH_ONE_REVIEW_EMAIL },
      });
      otherUserBookPrompt = otherUser.bookPrompts[0];
    });

    it('should return not found', async () => {
      const request = new NextRequest(url);
      establishAuth({ request, user });
      const response = await GET(request, {
        params: { bookPromptId: String(otherUserBookPrompt.id) },
      });

      expect(response.status).toEqual(404);
      expect(await response.json()).toEqual({
        error: 'Book prompt not found',
      });
    });
  });

  it('should fail when unauthorized', async () => {
    const request = new NextRequest(url);
    const response = await GET(request, { params: { bookPromptId: '1' } });

    expect(response.status).toEqual(401);
    expect(await response.json()).toEqual({
      error: 'Unauthorized',
    });
  });
});
