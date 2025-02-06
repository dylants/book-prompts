import BadRequestError from '@/lib/errors/BadRequestError';
import handleErrorResponse from '@/lib/errors/handleErrorResponse';
import logger from '@/lib/logger';
import { authMiddleware } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import AuthorReview from '@/types/AuthorReview';
import AuthorReviewUpdateInput from '@/types/AuthorReviewUpdateInput';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import Session from '@/types/Session';
import { NextRequest, NextResponse } from 'next/server';
import { toZod } from 'tozod';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export type PutRequestBody = AuthorReviewUpdateInput;

const putSchema: toZod<PutRequestBody> = z.object({
  rating: z.number(),
});

export type PutResponseBody = {
  data: AuthorReview;
};

export async function PUT(
  request: NextRequest,
  { params: { authorReviewId } }: { params: { authorReviewId: string } },
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

    const authorReview = await prisma.authorReview.update({
      data: {
        rating,
      },
      where: { id: authorReviewId, userId: session.user.id },
    });

    return NextResponse.json({ data: authorReview });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
