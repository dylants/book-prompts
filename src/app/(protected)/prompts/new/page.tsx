'use client';

import BookPromptComponent, {
  BookPromptFormInput,
} from '@/components/book-prompt/BookPromptComponent';
import useBookPromptContext from '@/hooks/useBookPromptContext';
import { BookCopyIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';

export default function RecommendationPage() {
  const { bookPrompt, createBookPrompt } = useBookPromptContext();
  const router = useRouter();

  const onRecommend: SubmitHandler<BookPromptFormInput> = useCallback(
    async (formInput) => {
      const { promptText } = formInput;
      await createBookPrompt({ promptText });
    },
    [createBookPrompt],
  );

  // only want to navigate once we have a book prompt created
  useEffect(() => {
    if (bookPrompt) {
      router.replace(`/prompts/${bookPrompt.id}`);
    }
  }, [bookPrompt, router]);

  return (
    <div>
      <h1 className="flex gap-2 items-center mb-10">
        <BookCopyIcon size={18} />
        Recommendations
      </h1>
      <div className="mt-[80px]">
        <BookPromptComponent onRecommend={onRecommend} />
      </div>
    </div>
  );
}
