import { cn } from '@/lib/tailwind-utils';
import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

const inputVariants = cva(
  'flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: '',
        error: 'border-red-500',
        ghost: 'border-none shadow-none focus-visible:ring-transparent',
        underline:
          'border-0 shadow-none focus-visible:ring-transparent rounded-none border-b-[1px] border-b-slate-400',
      },
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ className, variant }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
