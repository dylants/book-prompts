'use client';

import BookPromptContext, {
  BookPromptContextType,
} from '@/app/(protected)/recommendations/BookPromptContext';
import { PostRequestBody } from '@/app/api/protected/book-prompts/route';
import useHandleError from '@/hooks/useHandleError';
import { getBookPrompt, postBookPrompt } from '@/lib/api';
import BookPromptHydrated from '@/types/BookPromptHydrated';
import { useCallback, useState } from 'react';

export default function BookPromptContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [bookPrompt, setBookPrompt] = useState<BookPromptHydrated | null>(null);
  const { handleError } = useHandleError();

  const createBookPrompt = useCallback(
    async (bookPrompt: PostRequestBody) => {
      try {
        const { promptText } = bookPrompt;
        const createdBookPrompt = await postBookPrompt({ promptText });
        setBookPrompt(createdBookPrompt);
      } catch (error) {
        /* istanbul ignore next */
        return handleError(error);
      }
    },
    [handleError],
  );

  const loadBookPrompt = useCallback(
    async (bookPromptId: number) => {
      try {
        const loadedBookPrompt = await getBookPrompt({ bookPromptId });
        setBookPrompt(loadedBookPrompt);
      } catch (error) {
        /* istanbul ignore next */
        return handleError(error);
      }
    },
    [handleError],
  );

  const bookPromptContext: BookPromptContextType = {
    bookPrompt,
    createBookPrompt,
    loadBookPrompt,
  };

  return (
    <BookPromptContext.Provider value={bookPromptContext}>
      {children}
    </BookPromptContext.Provider>
  );
}
