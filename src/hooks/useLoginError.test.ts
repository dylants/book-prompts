/**
 * @jest-environment jsdom
 */

import useLoginError, { UseLoginErrorResult } from '@/hooks/useLoginError';
import LoginError from '@/types/LoginError';
import { renderHook } from '@testing-library/react';

const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

describe('useLoginError', () => {
  describe('buildLoginErrorUrl', () => {
    let buildLoginErrorUrl: UseLoginErrorResult['buildLoginErrorUrl'];

    beforeEach(() => {
      mockUsePathname.mockReturnValue('/');
      ({
        result: {
          current: { buildLoginErrorUrl },
        },
      } = renderHook(() => useLoginError()));
    });

    it('should build the correct invalid login url', () => {
      expect(buildLoginErrorUrl(LoginError.INVALID_LOGIN)).toEqual(
        '/login?login-error=invalid-login&return-url=/',
      );
    });

    it('should build the correct unauthorized url', () => {
      expect(buildLoginErrorUrl(LoginError.UNAUTHORIZED)).toEqual(
        '/login?login-error=unauthorized&return-url=/',
      );
    });
  });

  describe('parseLoginErrorUrl', () => {
    let parseLoginErrorUrl: UseLoginErrorResult['parseLoginErrorUrl'];

    beforeEach(() => {
      ({
        result: {
          current: { parseLoginErrorUrl },
        },
      } = renderHook(() => useLoginError()));
    });

    it('should parse invalid login', () => {
      const searchParams = new URLSearchParams('login-error=invalid-login');
      expect(parseLoginErrorUrl(searchParams)).toEqual({
        errorMessage: 'Invalid email and/or password',
      });
    });

    it('should parse unauthorized', () => {
      const searchParams = new URLSearchParams('login-error=unauthorized');
      expect(parseLoginErrorUrl(searchParams)).toEqual({
        errorMessage: 'Please login to continue',
      });
    });

    it('should return no error message when login-error is not recognized', () => {
      const searchParams = new URLSearchParams('login-error=foo');
      expect(parseLoginErrorUrl(searchParams)).toEqual({
        errorMessage: undefined,
      });
    });
  });

  describe('parseReturnUrl', () => {
    let parseReturnUrl: UseLoginErrorResult['parseReturnUrl'];

    beforeEach(() => {
      ({
        result: {
          current: { parseReturnUrl },
        },
      } = renderHook(() => useLoginError()));
    });

    it('should parse return url when present', () => {
      const searchParams = new URLSearchParams('return-url=/dashboard');
      expect(parseReturnUrl(searchParams)).toEqual({
        returnUrl: '/dashboard',
      });
    });

    it('should return null when return url is not present', () => {
      const searchParams = new URLSearchParams();
      expect(parseReturnUrl(searchParams)).toEqual({
        returnUrl: null,
      });
    });
  });

  describe('updateLoginError', () => {
    let updateLoginError: UseLoginErrorResult['updateLoginError'];

    beforeEach(() => {
      ({
        result: {
          current: { updateLoginError },
        },
      } = renderHook(() => useLoginError()));
    });

    it('should update login error while preserving return url', () => {
      const searchParams = new URLSearchParams('return-url=/dashboard');
      expect(updateLoginError(LoginError.INVALID_LOGIN, searchParams)).toEqual(
        '/login?login-error=invalid-login&return-url=/dashboard',
      );
    });

    it('should update login error when no return url exists', () => {
      const searchParams = new URLSearchParams();
      expect(updateLoginError(LoginError.UNAUTHORIZED, searchParams)).toEqual(
        '/login?login-error=unauthorized',
      );
    });
  });
});
