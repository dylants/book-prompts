import projectConfig from '@/config/index';
import { comparePassword } from '@/lib/encryption';
import logger from '@/lib/logger';
import { UnauthorizedError } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const authCookieName = projectConfig.auth.cookieName;

export type AuthPostRequestBody = {
  email: string;
  password: string;
};

export type AuthPostResponseBody = Record<string, never>;

export async function POST(
  request: NextRequest,
): Promise<NextResponse<AuthPostResponseBody | NextResponseErrorBody>> {
  logger.trace({}, `${request.nextUrl.pathname} ${request.method}`);

  try {
    const { email, password } = (await request.json()) as AuthPostRequestBody;
    logger.trace({ email }, 'Attempted login');

    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      logger.trace({ email }, 'User not found, returning UnauthorizedError');
      throw new UnauthorizedError();
    }

    const isValidPassword = await comparePassword({
      hash: user.password,
      password,
    });
    if (!isValidPassword) {
      logger.trace({ email }, 'Invalid password, returning UnauthorizedError');
      throw new UnauthorizedError();
    }

    logger.trace({ email }, 'Valid login auth');
    const cookieStore = cookies();
    cookieStore.set(authCookieName, user.uuid);

    return NextResponse.json({});
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } else {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      logger.error({ errorMessage }, 'Error occurred in login auth');

      return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
  }
}
