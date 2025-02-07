'use client';

import BookPromptsTable from '@/components/book-prompt/BookPromptsTable';
import { Button } from '@/components/ui/button';
import useHandleError from '@/hooks/useHandleError';
import { getBookPrompts } from '@/lib/api';
import BookPromptTable from '@/types/BookPromptTable';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function PromptsPage() {
  const [bookPrompts, setBookPrompts] = useState<BookPromptTable[]>([]);
  const [isLoadingBookPrompts, setIsLoadingBookPrompts] = useState(false);
  const pathname = usePathname();
  const { handleError } = useHandleError();

  const loadBookPrompts = useCallback(async () => {
    setIsLoadingBookPrompts(true);
    try {
      const bookPrompts = await getBookPrompts();
      setBookPrompts(bookPrompts);
    } catch (error) {
      return handleError(error);
    } finally {
      setIsLoadingBookPrompts(false);
    }
  }, [handleError]);

  useEffect(() => {
    loadBookPrompts();
  }, [loadBookPrompts]);

  return (
    <div className="grid gap-4">
      <h1>Your Book Prompts</h1>
      <div className="flex justify-end">
        <Link href="/prompts/new">
          <Button>New Prompt</Button>
        </Link>
      </div>
      <BookPromptsTable
        bookPrompts={bookPrompts}
        isLoading={isLoadingBookPrompts}
        linkPathname={pathname}
      />
    </div>
  );
}
