import { isbnHash } from '@/lib/hash';
import logger from '@/lib/logger';
import AIBookRecommendation from '@/types/AIBookRecommendation';
import BookCreateInput from '@/types/BookCreateInput';
import BookSearchResult from '@/types/BookSearchResult';
import _ from 'lodash';

export function buildBookFromSearchResult({
  recommendation,
  searchResult,
}: {
  recommendation: AIBookRecommendation;
  searchResult: BookSearchResult | null;
}): BookCreateInput {
  logger.trace({ recommendation, searchResult }, 'buildBookFromSearchResult');

  const { authors, title } = recommendation;

  const isbnExists: boolean = !!searchResult?.isbn13;
  logger.trace({ isbnExists }, 'isbnExists');

  const authorMatches: boolean =
    _.xor(authors, searchResult?.authors).length === 0;
  logger.trace({ authorMatches }, 'authorMatches');

  const titleMatches: boolean = !!searchResult?.title?.startsWith(title);
  logger.trace({ titleMatches }, 'titleMatches');

  const confirmedExists: boolean = isbnExists && authorMatches && titleMatches;

  const isbn13 = confirmedExists
    ? searchResult!.isbn13!
    : isbnHash({ authors, title });

  const imageUrl = confirmedExists ? searchResult?.imageUrl : undefined;

  const result: BookCreateInput = {
    authors,
    confirmedExists,
    imageUrl,
    isbn13,
    title,
  };
  logger.trace({ result }, 'buildBookFromSearchResult returning result');

  return result;
}
