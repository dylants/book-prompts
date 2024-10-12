import { GET, GetResponseBody } from '@/app/api/protected/book-reviews/route';
import projectConfig from '@/config/index';
import prisma from '@/lib/prisma';
import { BookReview } from '@prisma/client';
import { NextRequest } from 'next/server';
import { USER_WITH_REVIEWS_EMAIL } from '../../fixtures/user.fixture';

const url = 'https://localhost';

describe('/book-reviews GET', () => {
  let uuid: string;
  let existingBookReviews: BookReview[];

  beforeAll(async () => {
    const user = await prisma.user.findFirstOrThrow({
      include: {
        bookReviews: true,
      },
      where: { email: USER_WITH_REVIEWS_EMAIL },
    });

    existingBookReviews = user.bookReviews;
    uuid = user.uuid;
  });

  it('should return the book reviews', async () => {
    const request = new NextRequest(url, {
      method: 'GET',
    });
    request.cookies.set(projectConfig.auth.cookieName, uuid);

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
