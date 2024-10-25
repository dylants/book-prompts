import { PostRequestBody } from '@/app/api/protected/book-prompts/route';
import BookPromptHydrated from '@/types/BookPromptHydrated';
import { createContext } from 'react';

export type BookPromptContextType = {
  bookPrompt: BookPromptHydrated | null;
  createBookPrompt: (bookPrompt: PostRequestBody) => Promise<void>;
  loadBookPrompt: (bookPromptId: number) => Promise<void>;
};

const BookPromptContext = createContext<BookPromptContextType | null>(null);

export default BookPromptContext;
