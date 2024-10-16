import { default as config, default as projectConfig } from '@/config/index';
import handleErrorResponse from '@/lib/errors/handleErrorResponse';
import logger from '@/lib/logger';
import { authMiddleware } from '@/lib/middleware';
import prisma from '@/lib/prisma';
import RecommendBooksPrompt from '@/lib/prompts/RecommendBooksPrompt';
import { googleBookSearch } from '@/lib/search/google.search';
import { buildBookFromSearchResult } from '@/lib/search/search';
import HydratedBookRecommendation from '@/types/HydratedBookRecommendation';
import NextResponseErrorBody from '@/types/NextResponseErrorBody';
import Session from '@/types/Session';
import { NextRequest, NextResponse } from 'next/server';

const isFakeRecommendations = config.prompts.useFakeResponses === 'true';

export type PostResponseBody = {
  data: HydratedBookRecommendation[];
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
    const prompt = new RecommendBooksPrompt({ user: session.user });
    const aiRecommendations = await prompt.execute();

    logger.trace({ aiRecommendations }, 'AI Recommendations');

    const bookRecommendationPromises = aiRecommendations.map(
      async (recommendation) => {
        const { author, confidenceScore, explanation, title } = recommendation;

        // skip the google book search if we've got fake recommendations
        const searchResult = isFakeRecommendations
          ? /* istanbul ignore next */
            null
          : await googleBookSearch({ author, title });

        const book = buildBookFromSearchResult({
          recommendation,
          searchResult,
        });

        return await prisma.bookRecommendation.create({
          data: {
            aiModel: projectConfig.openai.model,
            book: {
              connectOrCreate: {
                create: book,
                where: { isbn13: book.isbn13 },
              },
            },
            confidenceScore,
            explanation,
            user: {
              connect: { id: session.user.id },
            },
          },
          include: {
            book: true,
          },
          omit: {
            aiModel: true,
            bookId: true,
            userId: true,
          },
        });
      },
    );

    const bookRecommendations = await Promise.all(bookRecommendationPromises);

    return NextResponse.json({ data: bookRecommendations });
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
