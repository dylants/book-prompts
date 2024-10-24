import BookRecommendation from '@/components/recommendations/BookRecommendation';
import { fakeBookRecommendationHydrated } from '@/lib/fakes/recommendation.fake';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BookRecommendation> = {
  component: BookRecommendation,
};

export default meta;
type Story = StoryObj<typeof BookRecommendation>;

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
