import projectConfig from '@/config/index';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import Session from '@/types/Session';
import { NextRequest, NextResponse } from 'next/server';

const authCookieName = projectConfig.auth.cookieName;

export class UnauthorizedError extends Error {}

export async function authMiddleware(request: NextRequest): Promise<Session> {
  const cookie = request.cookies.get(authCookieName);
  logger.trace({ cookie }, 'authMiddleware cookie');
  const uuid = cookie?.value;
  if (!uuid) {
    throw new UnauthorizedError();
  }

  const user = await prisma.user.findFirst({
    where: { uuid },
  });
  if (!user) {
    throw new UnauthorizedError();
  }

  return {
    user,
  };
}

export function handleMiddlewareError(
  error: unknown,
): NextResponse<NextResponseErrorBody> {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } else {
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
