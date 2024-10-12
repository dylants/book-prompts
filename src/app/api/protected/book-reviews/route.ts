import BadRequestError from '@/lib/errors/BadRequestError';
import handleErrorResponse from '@/lib/errors/handleErrorResponse';
import logger from '@/lib/logger';
import { authMiddleware } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import BookReviewCreateInput from '@/types/BookReviewCreateInput';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import Session from '@/types/Session';
import { BookReview } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { toZod } from 'tozod';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export type GetResponseBody = {
  data: BookReview[];
};

export async function GET(
  request: NextRequest,
): Promise<NextResponse<GetResponseBody | NextResponseErrorBody>> {
  logger.trace({}, `${request.nextUrl.pathname} ${request.method}`);

  let session: Session;

  try {
    session = await authMiddleware(request);
  } catch (error) {
    return handleErrorResponse(error);
  }

  try {
    const bookReviews = await prisma.bookReview.findMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      data: bookReviews,
    });
  } catch (error: unknown) {
    /* istanbul ignore next */
    return handleErrorResponse(error);
  }
}

export type PostRequestBody = BookReviewCreateInput;

const postSchema: toZod<PostRequestBody> = z.object({
  author: z.string(),
  rating: z.number(),
  title: z.string(),
});

export type PostResponseBody = {
  data: BookReview;
};

export async function POST(
  request: NextRequest,
): Promise<NextResponse<PostResponseBody | NextResponseErrorBody>> {
  logger.trace({}, `${request.nextUrl.pathname} ${request.method}`);

  let session: Session;

  try {
    session = await authMiddleware(request);
  } catch (error) {
    return handleErrorResponse(error);
  }

  try {
    const json = await request.json();
    const validatedBody = postSchema.safeParse(json);

    if (!validatedBody.success) {
      const message = fromZodError(validatedBody.error);
      throw new BadRequestError(message.toString());
    }

    const { author, rating, title } = validatedBody.data;

    const bookReview = await prisma.bookReview.create({
      data: {
        author,
        rating,
        title,
        user: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json({ data: bookReview });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
