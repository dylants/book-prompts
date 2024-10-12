import {
  PUT,
  PutResponseBody,
} from '@/app/api/protected/book-reviews/[bookReviewId]/route';
import projectConfig from '@/config/index';
import prisma from '@/lib/prisma';
import BookReviewUpdateInput from '@/types/BookReviewUpdateInput';
import { BookReview } from '@prisma/client';
import { NextRequest } from 'next/server';
import {
  USER_WITH_ONE_REVIEW_EMAIL,
  USER_WITH_REVIEWS_EMAIL,
} from '../../fixtures/user.fixture';

const url = 'https://localhost';

describe('/book-reviews/[bookReviewId] PUT', () => {
  let uuid: string;
  let existingBookReview: BookReview;

  beforeAll(async () => {
    const user = await prisma.user.findFirstOrThrow({
      include: {
        bookReviews: true,
      },
      where: { email: USER_WITH_REVIEWS_EMAIL },
    });

    existingBookReview = user.bookReviews[0];
    uuid = user.uuid;
  });

  afterAll(async () => {
    // restore the existing book review
    await prisma.bookReview.update({
      data: existingBookReview,
      where: { id: existingBookReview.id },
    });
  });

  it('should update the book review', async () => {
    // set the rating to 5, unless it's already 5, then 1
    const rating = existingBookReview.rating === 5 ? 1 : 5;
    const updates: BookReviewUpdateInput = {
      rating,
    };

    const request = new NextRequest(url, {
      body: JSON.stringify(updates),
      method: 'PUT',
    });
    request.cookies.set(projectConfig.auth.cookieName, uuid);

    const response = await PUT(request, {
      params: { bookReviewId: existingBookReview.id.toString() },
    });

    expect(response.status).toEqual(200);

    const body = (await response.json()) as PutResponseBody;
    expect(body.data).toEqual(
      expect.objectContaining({
        author: existingBookReview.author,
        rating,
        title: existingBookReview.title,
      }),
    );
  });

  it('should fail when unauthorized', async () => {
    const request = new NextRequest(url);

    const response = await PUT(request, {
      params: { bookReviewId: existingBookReview.id.toString() },
    });

    expect(response.status).toEqual(401);
    expect(await response.json()).toEqual({
      error: 'Unauthorized',
    });
  });

  it('should fail to update with bad data', async () => {
    const request = new NextRequest(url, {
      body: JSON.stringify({ rating: 'not number' }),
      method: 'PUT',
    });
    request.cookies.set(projectConfig.auth.cookieName, uuid);

    const response = await PUT(request, {
      params: { bookReviewId: existingBookReview.id.toString() },
    });

    expect(response.status).toEqual(400);
    expect(await response.json()).toEqual({
      error: 'Validation error: Expected number, received string at "rating"',
    });
  });

  it("should fail to update other user's book review", async () => {
    const otherUsersBookReview = await prisma.bookReview.findFirstOrThrow({
      where: {
        user: { email: USER_WITH_ONE_REVIEW_EMAIL },
      },
    });

    const request = new NextRequest(url, {
      body: JSON.stringify({ rating: 1 }),
      method: 'PUT',
    });
    request.cookies.set(projectConfig.auth.cookieName, uuid);

    const response = await PUT(request, {
      params: { bookReviewId: otherUsersBookReview.id.toString() },
    });

    // TODO we fail, but we should probably improve this failure message
    expect(response.status).toEqual(500);
    expect(await response.json()).toEqual({
      error: 'Unknown error',
    });
  });
});
