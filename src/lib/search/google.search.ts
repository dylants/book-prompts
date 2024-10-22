import logger from '@/lib/logger';
import BookSearchResult from '@/types/BookSearchResult';

function _buildQueryParam(param: string): string {
  return param.split(' ').join('+').toString();
}

export type GoogleBookSearchProps = {
  authors?: string[];
  title?: string;
};

export interface GoogleSearchResponse {
  totalItems: number;
  items: Array<{
    volumeInfo: {
      authors?: [string];
      imageLinks?: {
        thumbnail?: string;
      };
      industryIdentifiers: Array<{
        identifier: string;
        type: string;
      }>;
      title: string;
    };
  }>;
}

export async function googleBookSearch(
  search: GoogleBookSearchProps,
): Promise<BookSearchResult | null> {
  logger.trace({ search }, 'googleBookSearch');

  const authorQuery =
    search.authors && `inauthor:${_buildQueryParam(search.authors.join(' '))}`;
  const titleQuery =
    search.title && `intitle:${_buildQueryParam(search.title)}`;

  const query = [authorQuery, titleQuery].reduce<string | undefined>(
    (acc, value) => {
      if (acc && acc?.length > 0) {
        return `${acc}+${value}`;
      } else {
        return value;
      }
    },
    '',
  );
  logger.trace({ query }, 'googleBookSearch query');

  if (!query) {
    return null;
  }

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}`,
  );
  const data: GoogleSearchResponse = await response.json();

  // use the first item as the "best" result
  const item = data.items?.[0];
  logger.trace({ item }, 'first item from googleBookSearch query');

  if (!item) {
    logger.trace({ data }, 'no results found, returning null');
    return null;
  }

  const isbn13 = item.volumeInfo?.industryIdentifiers?.find(
    (identifier) => identifier.type === 'ISBN_13',
  )?.identifier;
  const imageUrl = item.volumeInfo?.imageLinks?.thumbnail?.replaceAll(
    'http://',
    'https://',
  );

  const result: BookSearchResult = {
    authors: item.volumeInfo?.authors,
    imageUrl,
    isbn13,
    title: item.volumeInfo?.title,
  };
  logger.trace({ result }, 'returning search result');

  return result;
}
