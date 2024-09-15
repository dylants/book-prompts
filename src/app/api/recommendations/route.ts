import logger from '@/lib/logger';
import RecommendBooksPrompt from '@/lib/prompts/RecommendBooksPrompt';

export async function POST() {
  logger.trace({}, '/api/recommendations POST');

  const prompt = new RecommendBooksPrompt();
  const recommendations = await prompt.execute();

  return Response.json(recommendations);
}
