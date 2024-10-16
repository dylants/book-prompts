/**
 * @jest-environment jsdom
 */

import useBookReviews from '@/hooks/useBookReviews';
import { fakeBookReview } from '@/lib/fakes/bookReview.fake';
import { BookReview } from '@prisma/client';
import { act, renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

jest.mock('next/navigation', () => ({
  useRouter: () => {},
}));

describe('useBookReviews', () => {
  const bookReview = {
    ...fakeBookReview(),
    id: -1,
    rating: 2,
  };
  const BOOK_REVIEWS: BookReview[] = [
    bookReview,
    fakeBookReview(),
    fakeBookReview(),
  ];

  const server = setupServer(
    rest.get('/api/protected/book-reviews', (_, res, ctx) => {
      return res(ctx.json({ data: BOOK_REVIEWS }));
    }),
    rest.post('/api/protected/book-reviews', async (req, res, ctx) => {
      const postedReview = await req.json();
      return res(ctx.json({ data: postedReview }));
    }),
    rest.put('/api/protected/book-reviews/-1', async (req, res, ctx) => {
      const updates = await req.json();
      return res(
        ctx.json({
          data: {
            ...bookReview,
            ...updates,
          },
        }),
      );
    }),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should load the book reviews', async () => {
    const { result } = renderHook(() => useBookReviews());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bookReviews).toEqual(
      JSON.parse(JSON.stringify(BOOK_REVIEWS)),
    );
  });

  it('should create a book review', async () => {
    const { result } = renderHook(() => useBookReviews());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bookReviews.length).toEqual(3);

    const { createBookReview } = result.current;
    await act(async () => {
      await createBookReview({
        bookReview: { bookId: 999, rating: 5 },
      });
    });

    expect(result.current.bookReviews.length).toEqual(4);
    expect(result.current.bookReviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          bookId: 999,
          rating: 5,
        }),
      ]),
    );
  });

  it('should update a book review', async () => {
    const { result } = renderHook(() => useBookReviews());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.bookReviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: -1,
          rating: 2,
        }),
      ]),
    );

    const { updateBookReview } = result.current;
    await act(async () => {
      await updateBookReview({
        id: -1,
        updates: { rating: 5 },
      });
    });

    expect(result.current.bookReviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: -1,
          rating: 5,
        }),
      ]),
    );
  });
});
