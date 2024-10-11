import { AuthDeleteResponseBody, DELETE } from '@/app/api/auth/route';
import projectConfig from '@/config/index';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import { NextRequest } from 'next/server';

const mockDeleteCookie = jest.fn();
jest.mock('next/headers', () => ({
  cookies: () => ({
    delete: (...args: unknown[]) => mockDeleteCookie(...args),
  }),
}));

const url = 'https://localhost';

describe('/auth DELETE API', () => {
  beforeEach(async () => {
    mockDeleteCookie.mockReset();
  });

  it('should delete the auth cookie', async () => {
    const request = new NextRequest(url, {
      method: 'DELETE',
    });

    const response = await DELETE(request);

    expect(response.status).toEqual(200);
    const responseBody: AuthDeleteResponseBody = await response.json();
    expect(responseBody).toEqual({
      data: {
        isLoggedIn: false,
      },
    });

    expect(mockDeleteCookie).toHaveBeenCalledWith(
      projectConfig.auth.cookieName,
    );
  });

  it('should return Unknown error when Error occurs', async () => {
    mockDeleteCookie.mockImplementation(() => {
      throw new Error('bad');
    });
    const request = new NextRequest(url, {
      method: 'DELETE',
    });

    const response = await DELETE(request);

    expect(response.status).toEqual(500);
    const responseBody: NextResponseErrorBody = await response.json();
    expect(responseBody).toEqual({ error: 'Unknown error' });
  });
});
