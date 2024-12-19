import BookHydrated from '@/types/BookHydrated';
import BookRecommendation from '@/types/BookRecommendation';

type BookRecommendationHydrated = BookRecommendation & {
  book: BookHydrated;
};

export default BookRecommendationHydrated;
