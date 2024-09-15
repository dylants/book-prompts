import { config, middleware } from 'middleware';
import { NextRequest } from 'next/server';

jest.mock('@/config/index', () => ({
  auth: {
    token: {
      name: 'AUTH_TOKEN',
      value: '123',
    },
  },
}));

describe('middleware.ts', () => {
  describe('middleware', () => {
    it('should pass through if the auth token exists', async () => {
      const req = new NextRequest(new Request('http://domain'), {
        headers: {
          AUTH_TOKEN: '123',
        },
      });
      const res = middleware(req);

      expect(res).toBeUndefined();
    });

    it('should fail if the auth token mismatches', async () => {
      const req = new NextRequest(new Request('http://domain'), {
        headers: {
          AUTH_TOKEN: '987',
        },
      });
      const res = middleware(req);

      expect(res?.status).toEqual(401);
      expect(await res?.json()).toEqual({ error: 'Unauthorized' });
    });

    it('should fail if auth token does NOT exist', async () => {
      const req = new NextRequest(new Request('http://domain'));
      const res = middleware(req);

      expect(res?.status).toEqual(401);
      expect(await res?.json()).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('config', () => {
    // Add test just to confirm we don't inadvertently change the path
    it('should match all API routes', () => {
      expect(config).toEqual({
        matcher: '/api/:path*',
      });
    });
  });
});
