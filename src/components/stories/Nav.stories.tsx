import Nav from '@/components/Nav';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Nav> = {
  component: Nav,
};

export default meta;
type Story = StoryObj<typeof Nav>;

export const NotLoggedIn: Story = {
  args: {
    auth: {
      isLoggedIn: false,
    },
    handleAuthClick: async () => {},
  },
};

export const LoggedIn: Story = {
  args: {
    auth: {
      email: 'test@fake.com',
      isLoggedIn: true,
    },
    handleAuthClick: async () => {},
  },
};
