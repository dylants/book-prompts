import { POST, PostResponseBody } from '@/app/api/protected/book-reviews/route';
import { isbnHash } from '@/lib/hash';
import prisma from '@/lib/prisma';
import BookReviewCreateInput from '@/types/BookReviewCreateInput';
import User from '@/types/User';
import { Book } from '@prisma/client';
import { NextRequest } from 'next/server';
import { USER_NO_REVIEWS_EMAIL } from '../../fixtures/user.fixture';
import { establishAuth } from '../../test-lib/auth';

const url = 'https://localhost';

describe('/api/protected/book-reviews POST', () => {
  let user: User;
  let book: Book;

  beforeAll(async () => {
    user = await prisma.user.findFirstOrThrow({
      where: { email: USER_NO_REVIEWS_EMAIL },
    });

    const authors = ['POST book-reviews test author'];
    const title = 'My Title';
    book = await prisma.book.create({
      data: {
        authors,
        confirmedExists: false,
        isbn13: isbnHash({ authors, title }),
        title,
      },
    });
  });

  afterAll(async () => {
    // delete the book we created (which will delete the book reviews)
    await prisma.book.delete({
      where: { id: book.id },
    });
  });

  it('should create and return the book review', async () => {
    const bookReview: BookReviewCreateInput = {
      bookId: book.id,
      rating: 3,
    };

    const request = new NextRequest(url, {
      body: JSON.stringify(bookReview),
      method: 'POST',
    });
    establishAuth({ request, user });

    const response = await POST(request);

    expect(response.status).toEqual(200);

    const body = (await response.json()) as PostResponseBody;
    expect(body.data).toEqual(
      expect.objectContaining({
        bookId: book.id,
        rating: 3,
      }),
    );
  });

  it('should fail when rating is below 0', async () => {
    const bookReview: BookReviewCreateInput = {
      bookId: book.id,
      rating: -1,
    };

    const request = new NextRequest(url, {
      body: JSON.stringify(bookReview),
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
    const bookReview: BookReviewCreateInput = {
      bookId: book.id,
      rating: 6,
    };

    const request = new NextRequest(url, {
      body: JSON.stringify(bookReview),
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
      error: 'Validation error: Required at "bookId"; Required at "rating"',
    });
  });
});
