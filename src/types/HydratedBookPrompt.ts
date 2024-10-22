import HydratedBookRecommendation from '@/types/HydratedBookRecommendation';
import { BookPrompt } from '@prisma/client';

type HydratedBookPrompt = Omit<BookPrompt, 'userId' | 'aiModel'> & {
  bookRecommendations: HydratedBookRecommendation[];
};

export default HydratedBookPrompt;
