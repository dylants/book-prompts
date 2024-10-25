/**
 * @jest-environment jsdom
 */

import BookPromptContext, {
  BookPromptContextType,
} from '@/app/(protected)/recommendations/BookPromptContext';
import BookPromptContextProvider from '@/app/(protected)/recommendations/BookPromptContextProvider';
import useBookPromptContext from '@/hooks/useBookPromptContext';
import { fakeBookPromptHydrated } from '@/lib/fakes/bookPrompt.fake';
import BookPromptHydrated from '@/types/BookPromptHydrated';
import { act, renderHook } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ReactNode } from 'react';

jest.mock('next/navigation', () => ({
  useRouter: () => {},
}));

describe('useBookPromptContext', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return context when it exists', () => {
    const context = { foo: 'bar' } as unknown as BookPromptContextType;

    const wrapper = ({ children }: { children: ReactNode }) => (
      <BookPromptContext.Provider value={context}>
        {children}
      </BookPromptContext.Provider>
    );
    const { result } = renderHook(() => useBookPromptContext(), { wrapper });

    expect(result.current).toEqual({ foo: 'bar' });
  });

  it('should throw error when no context exists', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      renderHook(() => useBookPromptContext()),
    ).toThrowErrorMatchingInlineSnapshot(
      `"useBookPromptContext used outside of provider"`,
    );
  });

  describe('with mock data', () => {
    const bookPromptHydrated: BookPromptHydrated = fakeBookPromptHydrated();

    const server = setupServer(
      rest.post('/api/protected/book-prompts', async (req, res, ctx) => {
        const bookPrompt = await req.json();
        return res(ctx.json({ data: bookPrompt }));
      }),
      rest.get('/api/protected/book-prompts/1', (_, res, ctx) => {
        return res(ctx.json({ data: bookPromptHydrated }));
      }),
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
    beforeEach(() => {
      wrapper = ({ children }: { children: ReactNode }) => (
        <BookPromptContextProvider>{children}</BookPromptContextProvider>
      );
    });

    it('should create the book prompt', async () => {
      const { result } = renderHook(() => useBookPromptContext(), { wrapper });

      expect(result.current.bookPrompt).toEqual(null);

      const { createBookPrompt } = result.current;

      await act(async () => {
        await createBookPrompt({
          promptText: 'test prompt',
        });
      });

      expect(result.current.bookPrompt).toEqual(
        expect.objectContaining({
          promptText: 'test prompt',
        }),
      );
    });

    it('should load the book prompt', async () => {
      const { result } = renderHook(() => useBookPromptContext(), { wrapper });

      expect(result.current.bookPrompt).toEqual(null);

      const { loadBookPrompt } = result.current;

      await act(async () => {
        await loadBookPrompt(1);
      });

      expect(result.current.bookPrompt).toEqual(
        JSON.parse(JSON.stringify(bookPromptHydrated)),
      );
    });
  });
});
