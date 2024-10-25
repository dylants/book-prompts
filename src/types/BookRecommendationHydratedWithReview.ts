import BookRecommendationHydrated from '@/types/BookRecommendationHydrated';
import BookReview from '@/types/BookReview';

type BookRecommendationHydratedWithReview = BookRecommendationHydrated & {
  bookReview?: BookReview;
};

export default BookRecommendationHydratedWithReview;
