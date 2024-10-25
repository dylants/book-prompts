import BookRecommendationWithReview from '@/components/recommendations/BookRecommendationWithReview';
import { fakeBookReview } from '@/lib/fakes/bookReview.fake';
import { fakeBookRecommendationHydrated } from '@/lib/fakes/recommendation.fake';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BookRecommendationWithReview> = {
  component: BookRecommendationWithReview,
};

export default meta;
type Story = StoryObj<typeof BookRecommendationWithReview>;

export const WithReview: Story = {
  args: {
    recommendationWithReview: {
      ...fakeBookRecommendationHydrated(),
      bookReview: fakeBookReview(),
    },
  },
};

export const WithoutReview: Story = {
  args: {
    recommendationWithReview: fakeBookRecommendationHydrated(),
  },
};

export const LoadingReview: Story = {
  args: {
    isLoadingReview: true,
    recommendationWithReview: fakeBookRecommendationHydrated(),
  },
};
