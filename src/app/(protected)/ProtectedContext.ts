import AuthorReviewCreateInput from '@/types/AuthorReviewCreateInput';
import AuthorReviewUpdateInput from '@/types/AuthorReviewUpdateInput';
import BookReview from '@/types/BookReview';
import BookReviewCreateInput from '@/types/BookReviewCreateInput';
import BookReviewUpdateInput from '@/types/BookReviewUpdateInput';
import { AuthorReview } from '@prisma/client';
import { createContext } from 'react';

export type ProtectedContextType = {
  authorReviews: AuthorReview[];
  bookReviews: BookReview[];
  createAuthorReview: ({
    authorReview,
  }: {
    authorReview: AuthorReviewCreateInput;
  }) => Promise<void>;
  createBookReview: ({
    bookReview,
  }: {
    bookReview: BookReviewCreateInput;
  }) => Promise<void>;
  updateAuthorReview: ({
    id,
    updates,
  }: {
    id: AuthorReview['id'];
    updates: AuthorReviewUpdateInput;
  }) => Promise<void>;
  updateBookReview: ({
    id,
    updates,
  }: {
    id: BookReview['id'];
    updates: BookReviewUpdateInput;
  }) => Promise<void>;
};

const ProtectedContext = createContext<ProtectedContextType | null>(null);

export default ProtectedContext;
