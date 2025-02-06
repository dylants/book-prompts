import BookRecommendationComponent from '@/components/recommendations/BookRecommendationComponent';
import { fakeBookReview } from '@/lib/fakes/bookReview.fake';
import { fakeBookRecommendationHydrated } from '@/lib/fakes/recommendation.fake';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BookRecommendationComponent> = {
  component: BookRecommendationComponent,
};

export default meta;
type Story = StoryObj<typeof BookRecommendationComponent>;

export const WithPicture: Story = {
  args: {
    recommendation: fakeBookRecommendationHydrated(),
  },
};

export const WithoutPicture: Story = {
  args: {
    recommendation: {
      ...fakeBookRecommendationHydrated(),
      book: {
        ...fakeBookRecommendationHydrated().book,
        imageUrl: null,
      },
    },
  },
};

export const WithBookReview: Story = {
  args: {
    bookReview: fakeBookReview(),
    recommendation: fakeBookRecommendationHydrated(),
  },
};
