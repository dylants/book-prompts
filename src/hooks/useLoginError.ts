import LoginError from '@/types/LoginError';
import { useCallback } from 'react';

export type UseLoginErrorResult = {
  buildLoginErrorUrl: (loginError: LoginError) => string;
  parseLoginErrorUrl: (searchParams: URLSearchParams) => {
    errorMessage?: string;
  };
};

const KEY = 'login-error';
const VALUES = {
  [LoginError.INVALID_LOGIN]: 'invalid-login',
  [LoginError.UNAUTHORIZED]: 'unauthorized',
} as const;

export default function useLoginError(): UseLoginErrorResult {
  const buildLoginErrorUrl = useCallback((loginError: LoginError) => {
    return `/login?${KEY}=${VALUES[loginError]}`;
  }, []);

  const parseLoginErrorUrl = useCallback((searchParams: URLSearchParams) => {
    const loginError = searchParams.get(KEY);

    let errorMessage;
    if (loginError === VALUES[LoginError.INVALID_LOGIN]) {
      errorMessage = 'Invalid email and/or password';
    } else if (loginError === VALUES[LoginError.UNAUTHORIZED]) {
      errorMessage = 'Please login to continue';
    }

    return { errorMessage };
  }, []);

  return { buildLoginErrorUrl, parseLoginErrorUrl };
}
