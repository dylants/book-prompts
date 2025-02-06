import {
  POST,
  PostResponseBody,
} from '@/app/api/protected/author-reviews/route';
import prisma from '@/lib/prisma';
import Author from '@/types/Author';
import AuthorReviewCreateInput from '@/types/AuthorReviewCreateInput';
import User from '@/types/User';
import { NextRequest } from 'next/server';
import { USER_NO_REVIEWS_EMAIL } from '../../fixtures/user.fixture';
import { establishAuth } from '../../test-lib/auth';

const url = 'https://localhost';

describe('/api/protected/author-reviews POST', () => {
  let user: User;
  let author: Author;
  const AUTHOR = 'POST author-reviews test author';

  beforeAll(async () => {
    user = await prisma.user.findFirstOrThrow({
      where: { email: USER_NO_REVIEWS_EMAIL },
    });

    author = await prisma.author.create({
      data: { name: AUTHOR },
    });
  });

  afterAll(async () => {
    // delete the author we created
    await prisma.author.delete({
      where: { name: AUTHOR },
    });
  });

  it('should create and return the author review', async () => {
    const authorReview: AuthorReviewCreateInput = {
      authorId: author.id,
      rating: 3,
    };

    const request = new NextRequest(url, {
      body: JSON.stringify(authorReview),
      method: 'POST',
    });
    establishAuth({ request, user });

    const response = await POST(request);

    expect(response.status).toEqual(200);

    const body = (await response.json()) as PostResponseBody;
    expect(body.data).toEqual(
      expect.objectContaining({
        authorId: author.id,
        rating: 3,
      }),
    );
  });

  it('should fail when rating is below 0', async () => {
    const authorReview: AuthorReviewCreateInput = {
      authorId: author.id,
      rating: -1,
    };

    const request = new NextRequest(url, {
      body: JSON.stringify(authorReview),
      method: 'POST',
    });
    establishAuth({ request, user });

    const response = await POST(request);

    // TODO we fail, but we should probably improve this failure message
    expect(response.status).toEqual(500);
    expect(await response.json()).toEqual({
      error: 'Unknown error',
    });
  });

  it('should fail when rating is above 5', async () => {
    const authorReview: AuthorReviewCreateInput = {
      authorId: author.id,
      rating: 6,
    };

    const request = new NextRequest(url, {
      body: JSON.stringify(authorReview),
      method: 'POST',
    });
    establishAuth({ request, user });

    const response = await POST(request);

    // TODO we fail, but we should probably improve this failure message
    expect(response.status).toEqual(500);
    expect(await response.json()).toEqual({
      error: 'Unknown error',
    });
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
    establishAuth({ request, user });

    const response = await POST(request);

    expect(response.status).toEqual(400);
    expect(await response.json()).toEqual({
      error: 'Validation error: Required at "authorId"; Required at "rating"',
    });
  });
});
