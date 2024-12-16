'use client';

import LoginError from '@/types/LoginError';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export type UseLoginErrorResult = {
  buildLoginErrorUrl: (loginError: LoginError) => string;
  parseLoginErrorUrl: (searchParams: URLSearchParams) => {
    errorMessage?: string;
  };
  parseReturnUrl: (searchParams: URLSearchParams) => {
    returnUrl: string | null;
  };
  updateLoginError: (
    loginError: LoginError,
    searchParams: URLSearchParams,
  ) => string;
};

const LOGIN_ERROR_KEY = 'login-error';
const LOGIN_ERROR_VALUES = {
  [LoginError.INVALID_LOGIN]: 'invalid-login',
  [LoginError.UNAUTHORIZED]: 'unauthorized',
} as const;
const RETURN_URL_KEY = 'return-url';

export default function useLoginError(): UseLoginErrorResult {
  const pathname = usePathname();

  const buildLoginErrorUrl = useCallback(
    (loginError: LoginError) => {
      return `/login?${LOGIN_ERROR_KEY}=${LOGIN_ERROR_VALUES[loginError]}&${RETURN_URL_KEY}=${pathname}`;
    },
    [pathname],
  );

  const parseLoginErrorUrl = useCallback((searchParams: URLSearchParams) => {
    const loginError = searchParams.get(LOGIN_ERROR_KEY);

    let errorMessage;
    if (loginError === LOGIN_ERROR_VALUES[LoginError.INVALID_LOGIN]) {
      errorMessage = 'Invalid email and/or password';
    } else if (loginError === LOGIN_ERROR_VALUES[LoginError.UNAUTHORIZED]) {
      errorMessage = 'Please login to continue';
    }

    return { errorMessage };
  }, []);

  const parseReturnUrl = useCallback((searchParams: URLSearchParams) => {
    const returnUrl = searchParams.get(RETURN_URL_KEY);

    return { returnUrl };
  }, []);

  const updateLoginError = useCallback(
    (loginError: LoginError, searchParams: URLSearchParams) => {
      let returnUrl = `/login?${LOGIN_ERROR_KEY}=${LOGIN_ERROR_VALUES[loginError]}`;

      const existingReturnUrl = searchParams.get(RETURN_URL_KEY);
      if (existingReturnUrl) {
        returnUrl += `&${RETURN_URL_KEY}=${existingReturnUrl}`;
      }

      return returnUrl;
    },
    [],
  );

  return {
    buildLoginErrorUrl,
    parseLoginErrorUrl,
    parseReturnUrl,
    updateLoginError,
  };
}
