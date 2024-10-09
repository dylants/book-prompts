import projectConfig from '@/config/index';
import { comparePassword } from '@/lib/encryption';
import { BadRequestError } from '@/lib/errors/BadRequestError';
import { handleErrorResponse } from '@/lib/errors/handleErrorResponse';
import { UnauthorizedError } from '@/lib/errors/UnauthorizedError';
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';
import AuthResponse from '@/types/AuthResponse';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { toZod } from 'tozod';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const authCookieName = projectConfig.auth.cookieName;

export type AuthGetResponseBody = AuthResponse;

export async function GET(
  request: NextRequest,
): Promise<NextResponse<AuthGetResponseBody | NextResponseErrorBody>> {
  logger.trace({}, `${request.nextUrl.pathname} ${request.method}`);

  try {
    const uuid = request.cookies.get(authCookieName)?.value;

    if (!uuid) {
      logger.trace({}, 'No uuid in auth cookie, returning not logged in');
      return NextResponse.json({
        isLoggedIn: false,
      });
    }

    const user = await prisma.user.findFirst({ where: { uuid } });
    if (!user) {
      logger.trace({ uuid }, 'No user for uuid, returning not logged in');
      return NextResponse.json({
        isLoggedIn: false,
      });
    }

    return NextResponse.json({
      email: user.email,
      isLoggedIn: true,
    });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}

export type AuthPostRequestBody = {
  email: string;
  password: string;
};

const postSchema: toZod<AuthPostRequestBody> = z.object({
  email: z.string(),
  password: z.string(),
});

export type AuthPostResponseBody = AuthResponse;

export async function POST(
  request: NextRequest,
): Promise<NextResponse<AuthPostResponseBody | NextResponseErrorBody>> {
  logger.trace({}, `${request.nextUrl.pathname} ${request.method}`);

  try {
    const json = await request.json();
    const validatedBody = postSchema.safeParse(json);

    if (!validatedBody.success) {
      const message = fromZodError(validatedBody.error);
      throw new BadRequestError(message.toString());
    }

    const { email, password } = validatedBody.data;

    logger.trace({ email }, 'Attempted login');

    const user = await prisma.user.findFirst({
      select: {
        email: true,
        password: true,
        uuid: true,
      },
      where: { email },
    });
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

    return NextResponse.json({
      email: user.email,
      isLoggedIn: true,
    });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
