/**
 * @jest-environment jsdom
 */

import useAuthorReviews from '@/hooks/useAuthorReviews';
import { fakeAuthorReview } from '@/lib/fakes/authorReview.fake';
import { AuthorReview } from '@prisma/client';
import { act, renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

jest.mock('next/navigation', () => ({
  useRouter: () => {},
}));

describe('useAuthorReviews', () => {
  const authorReview = {
    ...fakeAuthorReview(),
    id: 'abc',
    rating: 2,
  };
  const AUTHOR_REVIEWS: AuthorReview[] = [
    authorReview,
    fakeAuthorReview(),
    fakeAuthorReview(),
  ];

  const server = setupServer(
    rest.get('/api/protected/author-reviews', (_, res, ctx) => {
      return res(ctx.json({ data: AUTHOR_REVIEWS }));
    }),
    rest.post('/api/protected/author-reviews', async (req, res, ctx) => {
      const postedReview = await req.json();
      return res(ctx.json({ data: postedReview }));
    }),
    rest.put('/api/protected/author-reviews/abc', async (req, res, ctx) => {
      const updates = await req.json();
      return res(
        ctx.json({
          data: {
            ...authorReview,
            ...updates,
          },
        }),
      );
    }),
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should load the author reviews', async () => {
    const { result } = renderHook(() => useAuthorReviews());

    result.current.loadAuthorReviews();
    await waitFor(() => {
      expect(result.current.authorReviews).toBeDefined();
    });

    expect(result.current.authorReviews).toEqual(
      JSON.parse(JSON.stringify(AUTHOR_REVIEWS)),
    );
  });

  it('should create an author review', async () => {
    const { result } = renderHook(() => useAuthorReviews());

    result.current.loadAuthorReviews();
    await waitFor(() => {
      expect(result.current.authorReviews).toBeDefined();
    });

    expect(result.current.authorReviews?.length).toEqual(3);

    const { createAuthorReview } = result.current;
    await act(async () => {
      await createAuthorReview({
        authorReview: { authorId: 'xyz', rating: 5 },
      });
    });

    expect(result.current.authorReviews?.length).toEqual(4);
    expect(result.current.authorReviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorId: 'xyz',
          rating: 5,
        }),
      ]),
    );
  });

  it('should update an author review', async () => {
    const { result } = renderHook(() => useAuthorReviews());

    result.current.loadAuthorReviews();
    await waitFor(() => {
      expect(result.current.authorReviews).toBeDefined();
    });

    expect(result.current.authorReviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'abc',
          rating: 2,
        }),
      ]),
    );

    const { updateAuthorReview } = result.current;
    await act(async () => {
      await updateAuthorReview({
        id: 'abc',
        updates: { rating: 5 },
      });
    });

    expect(result.current.authorReviews).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'abc',
          rating: 5,
        }),
      ]),
    );
  });
});
