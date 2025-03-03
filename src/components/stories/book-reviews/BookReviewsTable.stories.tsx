import BookReviewsTable from '@/components/book-reviews/BookReviewsTable';
import { fakeBookReviewHydrated } from '@/lib/fakes/bookReview.fake';
import { Meta, StoryObj } from '@storybook/react';
import _ from 'lodash';

const meta: Meta<typeof BookReviewsTable> = {
  component: BookReviewsTable,
};

export default meta;
type Story = StoryObj<typeof BookReviewsTable>;

export const Default: Story = {
  render: () => {
    const bookReviews = _.times(10, () => fakeBookReviewHydrated());

    return (
      <div className="max-w-[768px]">
        <BookReviewsTable
          bookReviews={bookReviews}
          onSetBookReviewRating={async () => {}}
        />
      </div>
    );
  },
};

export const LotsOfReviews: Story = {
  render: () => {
    const bookReviews = _.times(100, () => fakeBookReviewHydrated());

    return (
      <div className="max-w-[768px]">
        <BookReviewsTable
          bookReviews={bookReviews}
          onSetBookReviewRating={async () => {}}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  render: () => {
    return (
      <div className="max-w-[768px]">
        <BookReviewsTable
          bookReviews={[]}
          isLoading
          onSetBookReviewRating={async () => {}}
        />
      </div>
    );
  },
};

export const NoReviews: Story = {
  render: () => {
    return (
      <div className="max-w-[768px]">
        <BookReviewsTable
          bookReviews={[]}
          onSetBookReviewRating={async () => {}}
        />
      </div>
    );
  },
};
