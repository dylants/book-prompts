import BookPrompt from '@/types/BookPrompt';
import BookRecommendationHydrated from '@/types/BookRecommendationHydrated';

type BookPromptHydrated = BookPrompt & {
  bookRecommendations: BookRecommendationHydrated[];
};

export default BookPromptHydrated;
