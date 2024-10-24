import config from '@/config/index';
import BadRequestError from '@/lib/errors/BadRequestError';
import handleErrorResponse from '@/lib/errors/handleErrorResponse';
import logger from '@/lib/logger';
import { authMiddleware } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import RecommendBooksPrompt from '@/lib/prompts/RecommendBooksPrompt';
import { googleBookSearch } from '@/lib/search/google.search';
import { buildBookFromSearchResult } from '@/lib/search/search';
import AIBookRecommendation from '@/types/AIBookRecommendation';
import BookPrompt from '@/types/BookPrompt';
import BookPromptHydrated from '@/types/BookPromptHydrated';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import Session from '@/types/Session';
import { NextRequest, NextResponse } from 'next/server';
import { toZod } from 'tozod';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export type GetResponseBody = {
  data: BookPrompt[];
};

export async function GET(
  req: NextRequest,
): Promise<NextResponse<GetResponseBody | NextResponseErrorBody>> {
  try {
    const session = await authMiddleware(req);

    const bookPrompts = await prisma.bookPrompt.findMany({
      omit: {
        aiModel: true,
        userId: true,
      },
      where: { userId: session.user.id },
    });

    return NextResponse.json({ data: bookPrompts });
  } catch (error) {
    return handleErrorResponse(error);
  }
}

export type PostRequestBody = {
  promptText: string;
};

const postSchema: toZod<PostRequestBody> = z.object({
  promptText: z.string(),
});

export type PostResponseBody = {
  data: BookPromptHydrated;
};

async function createBookRecommendations({
  aiRecommendations,
  bookPromptId,
}: {
  aiRecommendations: AIBookRecommendation[];
  bookPromptId: number;
}): Promise<void[]> {
  return Promise.all(
    aiRecommendations.map(async (recommendation) => {
      const { authors, confidenceScore, explanation, title } = recommendation;

      // skip the google book search if we've got fake recommendations
      const searchResult = config.prompts.shouldUseFakeResponses
        ? /* istanbul ignore next */
          null
        : await googleBookSearch({ authors, title });

      const book = buildBookFromSearchResult({
        recommendation,
        searchResult,
      });

      await prisma.bookRecommendation.create({
        data: {
          book: {
            connectOrCreate: {
              create: book,
              where: { isbn13: book.isbn13 },
            },
          },
          bookPrompt: { connect: { id: bookPromptId } },
          confidenceScore,
          explanation,
        },
      });

      return;
    }),
  );
}

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

    const { promptText } = validatedBody.data;

    const prompt = new RecommendBooksPrompt({ promptText, user: session.user });
    const aiRecommendations = await prompt.execute();

    logger.trace({ aiRecommendations }, 'RecommendBooksPrompt response');

    const { id: bookPromptId } = await prisma.bookPrompt.create({
      data: {
        aiModel: config.openai.model,
        promptText,
        user: {
          connect: { id: session.user.id },
        },
      },
      select: { id: true },
    });

    await createBookRecommendations({ aiRecommendations, bookPromptId });

    const bookPrompt = await prisma.bookPrompt.findFirstOrThrow({
      include: {
        bookRecommendations: {
          include: {
            book: true,
          },
          omit: {
            bookId: true,
            bookPromptId: true,
          },
        },
      },
      omit: {
        aiModel: true,
        userId: true,
      },
      where: { id: bookPromptId },
    });

    return NextResponse.json({ data: bookPrompt });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
