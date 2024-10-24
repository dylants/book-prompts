import BadRequestError from '@/lib/errors/BadRequestError';
import handleErrorResponse from '@/lib/errors/handleErrorResponse';
import logger from '@/lib/logger';
import { authMiddleware } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import BookReview from '@/types/BookReview';
import BookReviewUpdateInput from '@/types/BookReviewUpdateInput';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import Session from '@/types/Session';
import { NextRequest, NextResponse } from 'next/server';
import { toZod } from 'tozod';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export type PutRequestBody = BookReviewUpdateInput;

const putSchema: toZod<PutRequestBody> = z.object({
  rating: z.number().optional(),
});

export type PutResponseBody = {
  data: BookReview;
};

export async function PUT(
  request: NextRequest,
  { params: { bookReviewId } }: { params: { bookReviewId: string } },
): Promise<NextResponse<PutResponseBody | NextResponseErrorBody>> {
  logger.trace({}, `${request.nextUrl.pathname} ${request.method}`);

  let session: Session;

  try {
    session = await authMiddleware(request);
  } catch (error) {
    return handleErrorResponse(error);
  }

  try {
    const json = await request.json();
    const validatedBody = putSchema.safeParse(json);

    if (!validatedBody.success) {
      const message = fromZodError(validatedBody.error);
      throw new BadRequestError(message.toString());
    }

    const { rating } = validatedBody.data;

    const bookReview = await prisma.bookReview.update({
      data: {
        rating,
      },
      omit: {
        userId: true,
      },
      where: { id: Number(bookReviewId), userId: session.user.id },
    });

    return NextResponse.json({ data: bookReview });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
