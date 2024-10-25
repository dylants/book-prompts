/**
 * @jest-environment jsdom
 */

import AppContext, { AppContextType } from '@/app/AppContext';
import AppContextProvider from '@/app/AppContextProvider';
import useAppContext from '@/hooks/useAppContext';
import Auth from '@/types/Auth';
import { act, renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { ReactNode } from 'react';

describe('useAppContext', () => {
  it('should return context when it exists', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <AppContext.Provider value={{ foo: 'bar' } as unknown as AppContextType}>
        {children}
      </AppContext.Provider>
    );
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current).toEqual({ foo: 'bar' });
  });

  it('should throw error when no context exists', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() =>
      renderHook(() => useAppContext()),
    ).toThrowErrorMatchingInlineSnapshot(
      `"useAppContext used outside of provider"`,
    );
  });

  describe('with mock data', () => {
    const auth: Auth = { email: 'test@example.com', isLoggedIn: true };
    const server = setupServer(
      rest.get('/api/auth', (_, res, ctx) => {
        return res(ctx.json({ data: auth }));
      }),
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    let wrapper: ({ children }: { children: ReactNode }) => JSX.Element;
    beforeEach(() => {
      wrapper = ({ children }: { children: ReactNode }) => (
        <AppContextProvider>{children}</AppContextProvider>
      );
    });

    it('should load auth on mount', async () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.auth).toEqual(auth);
      });
    });

    it('should update auth when setAuth is called', async () => {
      const { result } = renderHook(() => useAppContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.auth).toBeTruthy();
      });

      act(() => {
        result.current.setAuth({ isLoggedIn: false });
      });

      expect(result.current.auth).toEqual({
        isLoggedIn: false,
      });
    });
  });
});
