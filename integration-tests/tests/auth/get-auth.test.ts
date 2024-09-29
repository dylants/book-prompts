import { AuthGetResponseBody, GET } from '@/app/api/auth/route';
import projectConfig from '@/config/index';
import prisma from '@/lib/prisma';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import User from '@/types/User';
import { NextRequest } from 'next/server';
import userFixtures from '../../fixtures/user.fixture';

const url = 'https://localhost';

describe('GET /auth API Integration Test', () => {
  const userFixture = userFixtures[0];
  let user: User;

  beforeAll(async () => {
    user = await prisma.user.findFirstOrThrow({
      where: { email: userFixture.email },
    });
  });

  it('should return logged in with valid auth', async () => {
    const request = new NextRequest(url);
    request.cookies.set(projectConfig.auth.cookieName, user.uuid);

    const response = await GET(request);
    expect(response.status).toEqual(200);
    const responseBody: AuthGetResponseBody = await response.json();
    expect(responseBody).toEqual({
      email: user.email,
      isLoggedIn: true,
    });
  });

  it('should return not logged in when cookie does not exist', async () => {
    const request = new NextRequest(url);

    const response = await GET(request);
    expect(response.status).toEqual(200);
    const responseBody: AuthGetResponseBody = await response.json();
    expect(responseBody).toEqual({
      isLoggedIn: false,
    });
  });

  it('should return not logged in when user does not exist', async () => {
    const request = new NextRequest(url);
    request.cookies.set(projectConfig.auth.cookieName, 'foo');

    const response = await GET(request);
    expect(response.status).toEqual(200);
    const responseBody: AuthGetResponseBody = await response.json();
    expect(responseBody).toEqual({
      isLoggedIn: false,
    });
  });

  it('should return Unknown error when Error occurs', async () => {
    const request = {
      cookies: {
        get: jest.fn().mockImplementation(() => {
          throw new Error('bad');
        }),
      },
      method: '',
      nextUrl: { pathname: '' },
    };

    const response = await GET(request as unknown as NextRequest);
    expect(response.status).toEqual(500);
    const responseBody: NextResponseErrorBody = await response.json();
    expect(responseBody).toEqual({ error: 'Unknown error' });
  });
});
