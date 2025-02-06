import BadRequestError from '@/lib/errors/BadRequestError';
import handleErrorResponse from '@/lib/errors/handleErrorResponse';
import logger from '@/lib/logger';
import { authMiddleware } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import AuthorReview from '@/types/AuthorReview';
import AuthorReviewCreateInput from '@/types/AuthorReviewCreateInput';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import Session from '@/types/Session';
import { NextRequest, NextResponse } from 'next/server';
import { toZod } from 'tozod';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export type GetResponseBody = {
  data: AuthorReview[];
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
    const authorReviews = await prisma.authorReview.findMany({
      orderBy: { createdAt: 'desc' },
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      data: authorReviews,
    });
  } catch (error: unknown) {
    /* istanbul ignore next */
    return handleErrorResponse(error);
  }
}

export type PostRequestBody = AuthorReviewCreateInput;

const postSchema: toZod<PostRequestBody> = z.object({
  authorId: z.string(),
  id: z.string().optional(),
  rating: z.number(),
});

export type PostResponseBody = {
  data: AuthorReview;
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

    const { authorId, id, rating } = validatedBody.data;

    const authorReview = await prisma.authorReview.create({
      data: {
        author: {
          connect: { id: authorId },
        },
        id,
        rating,
        user: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json({ data: authorReview });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
