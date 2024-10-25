import BookPrompt from '@/types/BookPrompt';
import { Genre } from '@/types/Genre';

export type BookPromptTable = Omit<
  BookPrompt,
  'promptGenreId' | 'promptSubgenreId'
> & {
  promptGenre: Genre | null;
  promptSubgenre: Genre | null;
};
