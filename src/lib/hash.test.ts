import { isbnHash } from '@/lib/hash';

describe('hash library', () => {
  describe('isbnHash', () => {
    it('should generate a hash string', () => {
      const actual = isbnHash({ author: 'author', title: 'title' });

      expect(actual).toBeTruthy();
      expect(typeof actual).toEqual('string');
    });

    it('should generate repeatable hash string', () => {
      const first = isbnHash({ author: 'author one', title: 'my title' });
      const second = isbnHash({ author: 'author one', title: 'my title' });

      expect(first).toEqual(second);
    });
  });
});
