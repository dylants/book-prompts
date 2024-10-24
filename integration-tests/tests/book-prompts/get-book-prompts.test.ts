import { GET, GetResponseBody } from '@/app/api/protected/book-prompts/route';
import prisma from '@/lib/prisma';
import User from '@/types/User';
import { NextRequest } from 'next/server';
import {
  USER_NO_REVIEWS_EMAIL,
  USER_WITH_REVIEWS_EMAIL,
} from '../../fixtures/user.fixture';
import { establishAuth } from '../../test-lib/auth';

const url = 'https://localhost';

describe('/api/protected/book-prompts GET Integration Test', () => {
  describe('when the user has book prompts', () => {
    let user: User;

    beforeAll(async () => {
      user = await prisma.user.findFirstOrThrow({
        where: { email: USER_WITH_REVIEWS_EMAIL },
      });
    });

    it('should return all book prompts for the user', async () => {
      const request = new NextRequest(url);
      establishAuth({ request, user });
      const response = await GET(request);

      expect(response.status).toEqual(200);
      const { data: bookPrompts } = (await response.json()) as GetResponseBody;

      expect(bookPrompts).toHaveLength(2);
      expect(bookPrompts).toEqual([
        expect.objectContaining({
          bookRecommendations: [
            expect.objectContaining({
              book: expect.objectContaining({
                id: 1,
              }),
              confidenceScore: '0.75',
              explanation: 'Explanation 1',
            }),
            expect.objectContaining({
              book: expect.objectContaining({
                id: 2,
              }),
              confidenceScore: '0.5',
              explanation: 'Explanation 2',
            }),
            expect.objectContaining({
              book: expect.objectContaining({
                id: 7,
              }),
              confidenceScore: '0.25',
              explanation: 'Explanation 3',
            }),
          ],
          promptText: 'feature witches',
        }),
        expect.objectContaining({
          bookRecommendations: [
            expect.objectContaining({
              book: expect.objectContaining({
                id: 4,
              }),
              confidenceScore: '0.75',
              explanation: 'Explanation 1',
            }),
            expect.objectContaining({
              book: expect.objectContaining({
                id: 5,
              }),
              confidenceScore: '0.5',
              explanation: 'Explanation 2',
            }),
          ],
          promptText: 'include gothic themes',
        }),
      ]);
    });
  });

  describe('when the user has no book prompts', () => {
    let user: User;

    beforeAll(async () => {
      user = await prisma.user.findFirstOrThrow({
        where: { email: USER_NO_REVIEWS_EMAIL },
      });
    });

    it('should return no book prompts', async () => {
      const request = new NextRequest(url);
      establishAuth({ request, user });
      const response = await GET(request);

      expect(response.status).toEqual(200);
      const { data: bookPrompts } = (await response.json()) as GetResponseBody;

      expect(bookPrompts).toHaveLength(0);
    });
  });

  it('should fail when unauthorized', async () => {
    const request = new NextRequest(url);
    const response = await GET(request);

    expect(response.status).toEqual(401);
    expect(await response.json()).toEqual({
      error: 'Unauthorized',
    });
  });
});
