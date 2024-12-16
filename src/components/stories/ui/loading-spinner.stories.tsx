import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LoadingSpinner> = {
  component: LoadingSpinner,
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Small: Story = {
  args: { size: 'sm' },
};

export const Default: Story = {
  args: {},
};

export const Large: Story = {
  args: { size: 'lg' },
};
