import projectConfig from '@/config/index';
import { UnauthorizedError } from '@/lib/errors/UnauthorizedError';
import { fakeUser } from '@/lib/fakes/user.fake';
import { authMiddleware } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

const url = 'http://localhost';
const authCookieName = projectConfig.auth.cookieName;

const mockFind = jest.spyOn(prisma.user, 'findFirst');

describe('src/lib/middleware', () => {
  beforeEach(() => {
    mockFind.mockReset();
  });

  describe('authMiddleware', () => {
    const user1 = fakeUser();

    it('should return the user with a valid cookie', async () => {
      const request = new NextRequest(url);
      request.cookies.set(authCookieName, user1.uuid);
      mockFind.mockResolvedValue(user1);

      expect(await authMiddleware(request)).toEqual({
        user: user1,
      });
    });

    it('should fail when the cookie does not exist', async () => {
      const request = new NextRequest(url);
      mockFind.mockResolvedValue(user1);

      expect.assertions(1);
      try {
        await authMiddleware(request);
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });

    it('should fail when the user does not match/exist', async () => {
      const request = new NextRequest(url);
      request.cookies.set(authCookieName, 'foo');
      mockFind.mockResolvedValue(null);

      expect.assertions(1);
      try {
        await authMiddleware(request);
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
  });
});
