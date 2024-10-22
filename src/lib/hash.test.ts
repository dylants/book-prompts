import { isbnHash } from '@/lib/hash';

describe('hash library', () => {
  describe('isbnHash', () => {
    it('should generate a hash string', () => {
      const actual = isbnHash({ authors: ['author'], title: 'title' });

      expect(actual).toBeTruthy();
      expect(typeof actual).toEqual('string');
    });

    it('should generate repeatable hash string (with one author)', () => {
      const first = isbnHash({ authors: ['author one'], title: 'my title' });
      const second = isbnHash({ authors: ['author one'], title: 'my title' });

      expect(first).toEqual(second);
    });

    it('should generate repeatable hash string (with multiple authors)', () => {
      const first = isbnHash({
        authors: ['author one', 'author two'],
        title: 'my title',
      });
      const second = isbnHash({
        authors: ['author one', 'author two'],
        title: 'my title',
      });

      expect(first).toEqual(second);
    });
  });
});
