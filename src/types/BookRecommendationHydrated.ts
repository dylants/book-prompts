import Book from '@/types/Book';
import BookRecommendation from '@/types/BookRecommendation';

type BookRecommendationHydrated = BookRecommendation & {
  book: Book;
};

export default BookRecommendationHydrated;
