import BookHydrated from '@/types/BookHydrated';
import BookReview from '@/types/BookReview';

type BookReviewHydrated = BookReview & {
  book: BookHydrated;
};

export default BookReviewHydrated;
