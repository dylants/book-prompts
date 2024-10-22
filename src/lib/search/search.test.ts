import { fakeAIBookRecommendation } from '@/lib/fakes/recommendation.fake';
import { isbnHash } from '@/lib/hash';
import { buildBookFromSearchResult } from '@/lib/search/search';
import BookSearchResult from '@/types/BookSearchResult';

describe('search library', () => {
  describe('buildBookFromSearchResult', () => {
    const recommendation = fakeAIBookRecommendation();

    it('should match when search result matches', () => {
      const { authors, title } = recommendation;

      const searchResult: BookSearchResult = {
        authors,
        imageUrl: 'my image url',
        isbn13: 'my isbn',
        title,
      };

      expect(
        buildBookFromSearchResult({ recommendation, searchResult }),
      ).toEqual({
        authors,
        confirmedExists: true,
        imageUrl: 'my image url',
        isbn13: 'my isbn',
        title,
      });
    });

    it('should match when the title starts with', () => {
      const shortTitle = 'This is a short title';
      const longTitle = `${shortTitle}: subtitle part that was missing`;

      const searchResult: BookSearchResult = {
        authors: recommendation.authors,
        imageUrl: 'my image url',
        isbn13: 'my isbn',
        title: longTitle,
      };

      expect(
        buildBookFromSearchResult({
          recommendation: {
            ...recommendation,
            title: shortTitle,
          },
          searchResult,
        }),
      ).toEqual({
        authors: recommendation.authors,
        confirmedExists: true,
        imageUrl: 'my image url',
        isbn13: 'my isbn',
        title: shortTitle,
      });
    });

    it('should not match when search result does not match', () => {
      const { authors, title } = recommendation;
      const searchResult: BookSearchResult = {
        authors: ['foo'],
        imageUrl: 'my image url',
        isbn13: 'my isbn',
        title: 'bar',
      };

      expect(
        buildBookFromSearchResult({ recommendation, searchResult }),
      ).toEqual({
        authors,
        confirmedExists: false,
        imageUrl: undefined,
        isbn13: isbnHash({ authors, title }),
        title,
      });
    });
  });
});
