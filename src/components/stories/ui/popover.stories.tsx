import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Popover> = {
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Login</h4>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="username">Username</Label>
                <Input id="username" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  className="col-span-2 h-8"
                  type="password"
                />
              </div>
              <div className="flex justify-end">
                <PopoverClose asChild>
                  <Button variant="default">Submit</Button>
                </PopoverClose>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  },
};
