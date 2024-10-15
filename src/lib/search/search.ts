import { isbnHash } from '@/lib/hash';
import logger from '@/lib/logger';
import AIBookRecommendation from '@/types/AIBookRecommendation';
import BookCreateInput from '@/types/BookCreateInput';
import BookSearchResult from '@/types/BookSearchResult';

export function buildBookFromSearchResult({
  recommendation,
  searchResult,
}: {
  recommendation: AIBookRecommendation;
  searchResult: BookSearchResult | null;
}): BookCreateInput {
  logger.trace({ recommendation, searchResult }, 'buildBookFromSearchResult');

  const { author, title } = recommendation;

  const confirmedExists: boolean =
    !!searchResult &&
    !!searchResult.isbn13 &&
    author === searchResult?.author &&
    !!searchResult?.title?.startsWith(title);

  const isbn13 = confirmedExists
    ? searchResult!.isbn13!
    : isbnHash({ author, title });

  const imageUrl = confirmedExists ? searchResult?.imageUrl : undefined;

  const result: BookCreateInput = {
    author,
    confirmedExists,
    imageUrl,
    isbn13,
    title,
  };
  logger.trace({ result }, 'buildBookFromSearchResult returning result');

  return result;
}
