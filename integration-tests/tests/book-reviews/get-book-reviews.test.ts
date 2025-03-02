import { GET, GetResponseBody } from '@/app/api/protected/book-reviews/route';
import prisma from '@/lib/prisma';
import BookReviewHydrated from '@/types/BookReviewHydrated';
import User from '@/types/User';
import { NextRequest } from 'next/server';
import { USER_WITH_REVIEWS_EMAIL } from '../../fixtures/user.fixture';
import { establishAuth } from '../../test-lib/auth';

const url = 'https://localhost';

describe('/book-reviews GET', () => {
  let user: User & { bookReviews: BookReviewHydrated[] };
  let existingBookReviews: BookReviewHydrated[];

  beforeAll(async () => {
    user = await prisma.user.findFirstOrThrow({
      include: {
        bookReviews: {
          include: {
            book: {
              include: {
                authors: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      where: { email: USER_WITH_REVIEWS_EMAIL },
    });

    existingBookReviews = user.bookReviews;
  });

  it('should return the book reviews', async () => {
    const request = new NextRequest(url, {
      method: 'GET',
    });
    establishAuth({ request, user });

    const response = await GET(request);

    expect(response.status).toEqual(200);

    const responseBody: GetResponseBody = await response.json();
    expect(responseBody.data).toEqual(
      JSON.parse(JSON.stringify(existingBookReviews)),
    );
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
