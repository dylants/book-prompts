'use client';

import BookPromptsTable from '@/components/book-prompt/BookPromptsTable';
import { Button } from '@/components/ui/button';
import { getBookPrompts } from '@/lib/api';
import { BookPromptTable } from '@/types/BookPromptTable';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function RecommendationsPage() {
  const [bookPrompts, setBookPrompts] = useState<BookPromptTable[]>([]);
  const pathname = usePathname();

  const loadBookPrompts = useCallback(async () => {
    const bookPrompts = await getBookPrompts();
    setBookPrompts(bookPrompts);
  }, []);

  useEffect(() => {
    loadBookPrompts();
  }, [loadBookPrompts]);

  return (
    <div>
      <div className="grid gap-4">
        <h1>Prompts and Recommendations</h1>
        <div className="flex justify-end">
          <Link href="/prompts/new">
            <Button>New Prompt</Button>
          </Link>
        </div>
        <BookPromptsTable bookPrompts={bookPrompts} linkPathname={pathname} />
      </div>
    </div>
  );
}
