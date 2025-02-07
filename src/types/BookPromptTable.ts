import BookPrompt from '@/types/BookPrompt';
import { Genre } from '@/types/Genre';

type BookPromptTable = BookPrompt & {
  promptGenre: Genre | null;
  promptSubgenre: Genre | null;
};

export default BookPromptTable;
