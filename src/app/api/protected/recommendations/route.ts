import logger from '@/lib/logger';
import RecommendBooksPrompt from '@/lib/prompts/RecommendBooksPrompt';
import Recommendation from '@/types/Recommendation';
import { NextResponse } from 'next/server';

type ResponseBody = {
  data: Recommendation[];
};

type ErrorBody = {
  error: string;
};

export async function POST(): Promise<NextResponse<ResponseBody | ErrorBody>> {
  logger.trace({}, '/api/protected/recommendations POST');

  try {
    const prompt = new RecommendBooksPrompt();
    const recommendations = await prompt.execute();

    return NextResponse.json({ data: recommendations });
  } catch (error: unknown) {
    let errorMessage;
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    logger.error({ errorMessage }, 'Error occurred in prompt');
    return NextResponse.json(
      { error: 'Error occurred in prompt' },
      { status: 500 },
    );
  }
}
