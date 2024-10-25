'use client';

import BookPromptContext, {
  BookPromptContextType,
} from '@/app/(protected)/recommendations/BookPromptContext';
import { useContext } from 'react';

export default function useBookPromptContext(): BookPromptContextType {
  const context = useContext(BookPromptContext);

  if (!context) {
    throw new Error('useBookPromptContext used outside of provider');
  }

  return context;
}
