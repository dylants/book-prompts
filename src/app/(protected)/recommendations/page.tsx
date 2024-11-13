'use client';

import BookPromptsTable from '@/components/book-prompt/BookPromptsTable';
import { Button } from '@/components/ui/button';
import { getBookPrompts } from '@/lib/api';
import { BookPromptTable } from '@/types/BookPromptTable';
import { BookCopyIcon } from 'lucide-react';
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
      <h1 className="flex gap-2 items-center mb-10">
        <BookCopyIcon size={18} />
        Recommendations
      </h1>
      <div className="grid gap-4">
        <div className="flex justify-end">
          <Link href="/recommendations/new">
            <Button>New</Button>
          </Link>
        </div>
        <BookPromptsTable bookPrompts={bookPrompts} linkPathname={pathname} />
      </div>
    </div>
  );
}
