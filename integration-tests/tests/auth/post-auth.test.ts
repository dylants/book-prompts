import {
  AuthPostRequestBody,
  AuthPostResponseBody,
  POST,
} from '@/app/api/auth/route';
import projectConfig from '@/config/index';
import prisma from '@/lib/prisma';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import User from '@/types/User';
import { NextRequest } from 'next/server';
import { PASSWORD, USER_WITH_REVIEWS_EMAIL } from '../../fixtures/user.fixture';

const mockSetCookies = jest.fn();
jest.mock('next/headers', () => ({
  cookies: () => ({
    set: (...args: unknown[]) => mockSetCookies(...args),
  }),
}));

const url = 'https://localhost';

const USER = {
  email: USER_WITH_REVIEWS_EMAIL,
  password: PASSWORD,
};

describe('/auth POST API', () => {
  let user: User;

  beforeAll(async () => {
    user = await prisma.user.findFirstOrThrow({
      where: { email: USER.email },
    });
  });

  beforeEach(async () => {
    mockSetCookies.mockReset();
  });

  it('should return auth cookie on successful login', async () => {
    const body: AuthPostRequestBody = {
      email: USER.email,
      password: USER.password,
    };
    const request = new NextRequest(url, {
      body: JSON.stringify(body),
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toEqual(200);
    const responseBody: AuthPostResponseBody | NextResponseErrorBody =
      await response.json();
    expect(responseBody).toEqual({
      data: {
        email: USER.email,
        isLoggedIn: true,
      },
    });

    expect(mockSetCookies).toHaveBeenCalledWith(
      projectConfig.auth.cookieName,
      user.id,
    );
  });

  it('should return Bad Request when the request data is invalid', async () => {
    const request = new NextRequest(url, {
      body: JSON.stringify({ hi: 'how are you?' }),
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toEqual(400);
    expect(await response.json()).toEqual({
      error: 'Validation error: Required at "email"; Required at "password"',
    });

    expect(mockSetCookies).not.toHaveBeenCalled();
  });

  it('should return Unauthorized when user does not exist', async () => {
    const body: AuthPostRequestBody = {
      email: 'user@doesnotexist.com',
      password: PASSWORD,
    };
    const request = new NextRequest(url, {
      body: JSON.stringify(body),
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toEqual(401);

    expect(mockSetCookies).not.toHaveBeenCalled();
  });

  it('should return Unauthorized when password does not match', async () => {
    const body: AuthPostRequestBody = {
      email: USER.email,
      password: 'bad',
    };
    const request = new NextRequest(url, {
      body: JSON.stringify(body),
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toEqual(401);
    const responseBody: AuthPostResponseBody | NextResponseErrorBody =
      await response.json();
    expect(responseBody).toEqual({ error: 'Unauthorized' });

    expect(mockSetCookies).not.toHaveBeenCalled();
  });

  it('should return Unknown error when Error occurs', async () => {
    mockSetCookies.mockImplementation(() => {
      throw new Error('bad');
    });
    const body: AuthPostRequestBody = {
      email: USER.email,
      password: USER.password,
    };
    const request = new NextRequest(url, {
      body: JSON.stringify(body),
      method: 'POST',
    });

    const response = await POST(request);

    expect(response.status).toEqual(500);
    const responseBody: AuthPostResponseBody | NextResponseErrorBody =
      await response.json();
    expect(responseBody).toEqual({ error: 'Unknown error' });
  });
});
