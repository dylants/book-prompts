import BookPromptsTable from '@/components/book-prompt/BookPromptsTable';
import { fakeBookPromptTable } from '@/lib/fakes/bookPrompt.fake';
import { Meta, StoryObj } from '@storybook/react';
import _ from 'lodash';

const meta: Meta<typeof BookPromptsTable> = {
  component: BookPromptsTable,
};

export default meta;
type Story = StoryObj<typeof BookPromptsTable>;

export const Default: Story = {
  render: () => {
    const bookPrompts = _.times(20, () => fakeBookPromptTable());

    return (
      <div>
        <BookPromptsTable bookPrompts={bookPrompts} linkPathname="#" />
      </div>
    );
  },
};
