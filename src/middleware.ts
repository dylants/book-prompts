import projectConfig from '@/config/index';
import type { NextRequest } from 'next/server';

const authToken = projectConfig.auth.token;

export function middleware(request: NextRequest) {
  if (request.headers.get(authToken.name) !== authToken.value) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export const config = {
  matcher: '/api/protected/:path*',
};
