import BookPrompt from '@/types/BookPrompt';
import HydratedBookRecommendation from '@/types/BookRecommendationHydrated';

type BookPromptHydrated = BookPrompt & {
  bookRecommendations: HydratedBookRecommendation[];
};

export default BookPromptHydrated;
