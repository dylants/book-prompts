import {
  googleBookSearch,
  GoogleSearchResponse,
} from '@/lib/search/google.search';
import BookSearchResult from '@/types/BookSearchResult';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('google.search library', () => {
  const GOOGLE_BOOK_FOUND: GoogleSearchResponse = {
    items: [
      {
        volumeInfo: {
          authors: ['Cressida Cowell'],
          imageLinks: {
            thumbnail:
              'http://books.google.com/books/content?id=28_qngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
          },
          industryIdentifiers: [
            {
              identifier: '0316085278',
              type: 'ISBN_10',
            },
            {
              identifier: '9780316085274',
              type: 'ISBN_13',
            },
          ],
          title: 'How to Train Your Dragon',
        },
      },
    ],
    totalItems: 1,
  };

  const GOOGLE_BOOK_FOUND_WITHOUT_DETAIL: GoogleSearchResponse = {
    items: [
      {
        volumeInfo: {
          industryIdentifiers: [],
          title: 'How to Train Your Dragon',
        },
      },
    ],
    totalItems: 1,
  };

  const GOOGLE_BOOK_NOT_FOUND: GoogleSearchResponse = {
    items: [],
    totalItems: 0,
  };

  describe('googleBookSearch', () => {
    const author = 'Cressida Cowell';
    const title = 'How to Train Your Dragon';

    describe('when the book exists', () => {
      const server = setupServer(
        rest.get('https://www.googleapis.com/*', (_, res, ctx) => {
          return res(ctx.json(GOOGLE_BOOK_FOUND));
        }),
      );
      const searchResult: BookSearchResult = {
        author: 'Cressida Cowell',
        imageUrl:
          'https://books.google.com/books/content?id=28_qngEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        isbn13: '9780316085274',
        title: 'How to Train Your Dragon',
      };

      beforeAll(() => server.listen());
      afterEach(() => server.resetHandlers());
      afterAll(() => server.close());

      it('should return the book details', async () => {
        const result = await googleBookSearch({ author, title });
        expect(result).toEqual(searchResult);
      });

      it('should return null with no author/title supplied', async () => {
        const result = await googleBookSearch({});
        expect(result).toEqual(null);
      });
    });

    describe('when the book exists without detail', () => {
      const server = setupServer(
        rest.get('https://www.googleapis.com/*', (_, res, ctx) => {
          return res(ctx.json(GOOGLE_BOOK_FOUND_WITHOUT_DETAIL));
        }),
      );
      const searchResult: BookSearchResult = {
        author: undefined,
        imageUrl: undefined,
        isbn13: undefined,
        title: 'How to Train Your Dragon',
      };

      beforeAll(() => server.listen());
      afterEach(() => server.resetHandlers());
      afterAll(() => server.close());

      it('should return the book details', async () => {
        const result = await googleBookSearch({ author, title });
        expect(result).toEqual(searchResult);
      });
    });

    describe('when the book does NOT exist', () => {
      const server = setupServer(
        rest.get('https://www.googleapis.com/*', (_, res, ctx) => {
          return res(ctx.json(GOOGLE_BOOK_NOT_FOUND));
        }),
      );

      beforeAll(() => server.listen());
      afterEach(() => server.resetHandlers());
      afterAll(() => server.close());

      it('should return null', async () => {
        const result = await googleBookSearch({ author, title });
        expect(result).toEqual(null);
      });
    });
  });
});
