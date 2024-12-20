import BookPrompt from '@/types/BookPrompt';
import { Genre } from '@/types/Genre';

export type BookPromptTable = BookPrompt & {
  promptGenre: Genre | null;
  promptSubgenre: Genre | null;
};
