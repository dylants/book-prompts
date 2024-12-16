import useLoginError from '@/hooks/useLoginError';
import UnauthorizedError from '@/lib/errors/UnauthorizedError';
import LoginError from '@/types/LoginError';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export type UseHandleErrorResult = {
  handleError: (error: unknown) => void;
};

export default function useHandleError(): UseHandleErrorResult {
  const router = useRouter();
  const { buildLoginErrorUrl } = useLoginError();

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof UnauthorizedError) {
        return router.push(buildLoginErrorUrl(LoginError.UNAUTHORIZED));
      } else {
        return router.push('/error');
      }
    },
    [buildLoginErrorUrl, router],
  );

  return { handleError };
}
