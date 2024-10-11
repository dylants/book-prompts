import projectConfig from '@/config/index';
import UnauthorizedError from '@/lib/errors/UnauthorizedError';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import Session from '@/types/Session';
import { NextRequest } from 'next/server';

const authCookieName = projectConfig.auth.cookieName;

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
