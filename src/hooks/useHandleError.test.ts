/**
 * @jest-environment jsdom
 */

import useHandleError from '@/hooks/useHandleError';
import UnauthorizedError from '@/lib/errors/UnauthorizedError';
import { renderHook } from '@testing-library/react';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('useHandleError', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('route to the login page on UnauthorizedError', () => {
    const {
      result: {
        current: { handleError },
      },
    } = renderHook(() => useHandleError());

    handleError(new UnauthorizedError());

    expect(mockPush).toHaveBeenCalledWith('/login?login-error=unauthorized');
  });

  it('route to error page on Error', () => {
    const {
      result: {
        current: { handleError },
      },
    } = renderHook(() => useHandleError());

    handleError(new Error());

    expect(mockPush).toHaveBeenCalledWith('/500');
  });
});
