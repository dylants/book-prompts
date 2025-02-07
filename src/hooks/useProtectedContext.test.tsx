/**
 * @jest-environment jsdom
 */

import ProtectedContext, {
  ProtectedContextType,
} from '@/app/(protected)/ProtectedContext';
import ProtectedContextProvider from '@/app/(protected)/ProtectedContextProvider';
import useProtectedContext from '@/hooks/useProtectedContext';
import { fakeAuthorReview } from '@/lib/fakes/authorReview.fake';
import { fakeBookReview } from '@/lib/fakes/bookReview.fake';
import AuthorReview from '@/types/AuthorReview';
import { BookReview } from '@prisma/client';
import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ReactNode } from 'react';

jest.mock('next/navigation', () => ({
  useRouter: () => {},
}));

describe('useProtectedContext', () => {
  it('should return context when it exists', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <ProtectedContext.Provider
        value={{ foo: 'bar' } as unknown as ProtectedContextType}
      >
        {children}
      </ProtectedContext.Provider>
    );
    const { result } = renderHook(() => useProtectedContext(), { wrapper });

    expect(result.current).toEqual({ foo: 'bar' });
  });

  it('should throw error when no context exists', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      renderHook(() => useProtectedContext()),
    ).toThrowErrorMatchingInlineSnapshot(
      `"useProtectedContext used outside of provider"`,
    );
  });

  describe('with mock data', () => {
    const AUTHOR_REVIEWS: AuthorReview[] = [
      fakeAuthorReview(),
      fakeAuthorReview(),
    ];
    const BOOK_REVIEWS: BookReview[] = [fakeBookReview(), fakeBookReview()];
    const server = setupServer(
      rest.get('/api/protected/author-reviews', (_, res, ctx) => {
        return res(ctx.json({ data: AUTHOR_REVIEWS }));
      }),
      rest.get('/api/protected/book-reviews', (_, res, ctx) => {
        return res(ctx.json({ data: BOOK_REVIEWS }));
      }),
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
    beforeEach(() => {
      wrapper = ({ children }: { children: ReactNode }) => (
        <ProtectedContextProvider>{children}</ProtectedContextProvider>
      );
    });

    it('should load reviews on mount', async () => {
      const { result } = renderHook(() => useProtectedContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.bookReviews).toEqual(
          JSON.parse(JSON.stringify(BOOK_REVIEWS)),
        );
      });
    });
  });
});
