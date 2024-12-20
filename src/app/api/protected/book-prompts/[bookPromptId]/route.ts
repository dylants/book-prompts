import handleErrorResponse from '@/lib/errors/handleErrorResponse';
import NotFoundError from '@/lib/errors/NotFoundError';
import { authMiddleware } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import BookPromptHydrated from '@/types/BookPromptHydrated';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import { NextRequest, NextResponse } from 'next/server';

export type GetResponseBody = {
  data: BookPromptHydrated;
};

export async function GET(
  req: NextRequest,
  { params }: { params: { bookPromptId: string } },
): Promise<NextResponse<GetResponseBody | NextResponseErrorBody>> {
  try {
    const session = await authMiddleware(req);
    const bookPromptId = params.bookPromptId;

    const bookPrompt = await prisma.bookPrompt.findFirst({
      include: {
        bookRecommendations: {
          include: {
            book: {
              include: {
                authors: true,
              },
            },
          },
          orderBy: { confidenceScore: 'desc' },
        },
      },
      where: {
        id: bookPromptId,
        userId: session.user.id,
      },
    });

    if (!bookPrompt) {
      throw new NotFoundError('Book prompt not found');
    }

    return NextResponse.json({ data: bookPrompt });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
