/**
 * @jest-environment jsdom
 */

import useLoginError, { UseLoginErrorResult } from '@/hooks/useLoginError';
import LoginError from '@/types/LoginError';
import { renderHook } from '@testing-library/react';

describe('useLoginError', () => {
  describe('buildLoginErrorUrl', () => {
    let buildLoginErrorUrl: UseLoginErrorResult['buildLoginErrorUrl'];

    beforeEach(() => {
      ({
        result: {
          current: { buildLoginErrorUrl },
        },
      } = renderHook(() => useLoginError()));
    });

    it('should build the correct invalid login url', () => {
      expect(buildLoginErrorUrl(LoginError.INVALID_LOGIN)).toEqual(
        '/login?login-error=invalid-login',
      );
    });

    it('should build the correct unauthorized url', () => {
      expect(buildLoginErrorUrl(LoginError.UNAUTHORIZED)).toEqual(
        '/login?login-error=unauthorized',
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
  });
});
