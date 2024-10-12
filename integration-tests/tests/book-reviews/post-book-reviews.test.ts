import { POST, PostResponseBody } from '@/app/api/protected/book-reviews/route';
import projectConfig from '@/config/index';
import prisma from '@/lib/prisma';
import BookReviewCreateInput from '@/types/BookReviewCreateInput';
import { NextRequest } from 'next/server';
import { USER_NO_REVIEWS_EMAIL } from '../../fixtures/user.fixture';

const url = 'https://localhost';

describe('/book-reviews POST', () => {
  const AUTHOR_NAME = 'POST book-reviews test author';
  let uuid: string;

  beforeAll(async () => {
    const user = await prisma.user.findFirstOrThrow({
      select: { uuid: true },
      where: { email: USER_NO_REVIEWS_EMAIL },
    });

    uuid = user.uuid;
  });

  afterEach(async () => {
    // delete the book review we created
    await prisma.bookReview.deleteMany({
      where: { author: AUTHOR_NAME },
    });
  });

  it('should create and return the book review', async () => {
    const bookReview: BookReviewCreateInput = {
      author: AUTHOR_NAME,
      rating: 3,
      title: 'My Title',
    };

    const request = new NextRequest(url, {
      body: JSON.stringify(bookReview),
      method: 'POST',
    });
    request.cookies.set(projectConfig.auth.cookieName, uuid);

    const response = await POST(request);

    expect(response.status).toEqual(200);

    const body = (await response.json()) as PostResponseBody;
    expect(body.data).toEqual(
      expect.objectContaining({
        author: AUTHOR_NAME,
        rating: 3,
        title: 'My Title',
      }),
    );
  });

  it('should fail when unauthorized', async () => {
    const request = new NextRequest(url);

    const response = await POST(request);

    expect(response.status).toEqual(401);
    expect(await response.json()).toEqual({
      error: 'Unauthorized',
    });
  });

  it('should fail with invalid request data', async () => {
    const request = new NextRequest(url, {
      body: JSON.stringify({ bad: 'data' }),
      method: 'POST',
    });
    request.cookies.set(projectConfig.auth.cookieName, uuid);

    const response = await POST(request);

    expect(response.status).toEqual(400);
    expect(await response.json()).toEqual({
      error:
        'Validation error: Required at "author"; Required at "rating"; Required at "title"',
    });
  });
});
