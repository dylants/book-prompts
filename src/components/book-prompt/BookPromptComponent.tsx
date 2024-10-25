'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/tailwind-utils';
import BookPrompt from '@/types/BookPrompt';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export type BookPromptFormInput = {
  promptText: string;
};

export type BookPromptComponentProps = {
  bookPrompt?: BookPrompt;
  onRecommend: SubmitHandler<BookPromptFormInput>;
  onReturn?: () => void;
};

export default function BookPromptComponent({
  bookPrompt,
  onRecommend,
  onReturn,
}: BookPromptComponentProps) {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<BookPromptFormInput>({
    defaultValues: {
      promptText: bookPrompt?.promptText,
    },
  });

  const onSubmit: SubmitHandler<BookPromptFormInput> = useCallback(
    async (formInput) => {
      await onRecommend(formInput);
      setIsEditMode(false);
    },
    [onRecommend],
  );

  const showForm = !bookPrompt || isEditMode;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full justify-center"
    >
      <AnimatePresence initial={false}>
        <motion.div
          layout
          className={cn('flex font-light', showForm ? 'w-3/4' : 'w-full')}
        >
          {showForm ? (
            <motion.div key="edit" className="grid gap-4 w-full h-[120px]">
              <motion.div layout className="flex flex-col gap-1">
                <p>Recommend books to me that...</p>
                <Input
                  autoFocus
                  className={cn(errors.promptText && 'border-b-red-500')}
                  defaultValue={bookPrompt?.promptText}
                  variant="underline"
                  {...register('promptText', { required: true })}
                />
              </motion.div>
              <motion.div
                layout
                initial={{ x: 325 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end gap-2"
              >
                {isEditMode && (
                  <Button
                    onClick={() => {
                      reset();
                      setIsEditMode(false);
                    }}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="default">
                  Recommend
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ height: 120 }}
              animate={{ height: 'fit-content' }}
              exit={{ height: 120 }}
              className="grid gap-1 w-full"
            >
              <motion.p layout>
                <span className="italic">
                  Recommendations for books that...
                </span>{' '}
                <span className="font-bold">{bookPrompt?.promptText}</span>
              </motion.p>
              <motion.div
                layout
                initial={{ x: -325 }}
                animate={{ x: 0 }}
                transition={{ bounce: 0, duration: 0.3 }}
                className="flex justify-end gap-2"
              >
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsEditMode(true)}
                >
                  Update Prompt
                </Button>
                <Button variant="default" type="button" onClick={onReturn}>
                  Return Home
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
