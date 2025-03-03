import ReviewStars from '@/components/ReviewStars';
import DataTable from '@/components/table/DataTable';
import SortableHeader from '@/components/table/SortableHeader';
import { TableCell, TableHead } from '@/components/ui/table';
import BookHydrated from '@/types/BookHydrated';
import BookReviewHydrated from '@/types/BookReviewHydrated';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

const getColumns = (
  onSetBookReviewRating: ({
    id,
    rating,
  }: {
    id: string;
    rating: number;
  }) => Promise<void>,
): ColumnDef<BookReviewHydrated>[] => [
  {
    accessorFn: (bookReview) => bookReview.book,
    cell: (props) => {
      const book = props.getValue() as BookHydrated;

      return (
        <div className="flex items-center">
          {book.imageUrl && (
            <Image
              alt={book.title}
              src={book.imageUrl}
              width={16}
              height={24}
            />
          )}
        </div>
      );
    },
    header: 'Image',
  },
  {
    accessorFn: (bookReview) => bookReview.book.title,
    id: 'title',
    meta: {
      cell: (props) => (
        <TableCell className="w-[300px] max-w-[300px]">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <>{props.getValue() as string}</>
          </div>
        </TableCell>
      ),
      header: ({ column }) => (
        <TableHead className="w-[300px] max-w-[300px]">
          <SortableHeader
            column={column}
            text="Title"
            className="justify-start"
          />
        </TableHead>
      ),
    },
  },
  {
    accessorFn: (bookReview) =>
      bookReview.book.authors.map((a) => a.name).join(', '),
    id: 'authors',
    meta: {
      cell: (props) => (
        <TableCell className="w-[300px] max-w-[300px]">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <>{props.getValue() as string}</>
          </div>
        </TableCell>
      ),
      header: ({ column }) => (
        <TableHead className="w-[300px] max-w-[300px]">
          <SortableHeader
            column={column}
            text="Authors"
            className="justify-start"
          />
        </TableHead>
      ),
    },
  },
  {
    accessorFn: (bookReview) => bookReview,
    cell: (props) => {
      const bookReview = props.getValue() as BookReviewHydrated;
      const { id, rating } = bookReview;

      return (
        <div className="flex items-center">
          <ReviewStars
            onSetScore={(rating: number) =>
              onSetBookReviewRating({ id, rating })
            }
            score={rating}
          />
        </div>
      );
    },
    header: ({ column }) => (
      <SortableHeader column={column} text="Rating" className="justify-start" />
    ),
    id: 'rating',
  },
];

export default function BookReviewsTable({
  bookReviews,
  isLoading,
  onSetBookReviewRating,
}: {
  bookReviews: BookReviewHydrated[];
  isLoading?: boolean;
  onSetBookReviewRating: ({
    id,
    rating,
  }: {
    id: string;
    rating: number;
  }) => Promise<void>;
}) {
  return (
    <DataTable
      columns={getColumns(onSetBookReviewRating)}
      data={bookReviews}
      isLoading={isLoading}
      noDataText="No reviews found"
    />
  );
}
