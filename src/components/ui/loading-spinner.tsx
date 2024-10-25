import * as React from 'react';

import { VariantProps, cva } from 'class-variance-authority';
import { cn } from 'lib/tailwind-utils';
import { LoaderCircle } from 'lucide-react';

const loadingVariants = cva('animate-spin', {
  defaultVariants: {
    size: 'default',
  },
  variants: {
    size: {
      default: 'h-12 w-12',
      lg: 'h-16 w-16',
      sm: 'h-8 w-8',
    },
  },
});

export interface LoadingSpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof loadingVariants> {}

const LoadingSpinner = ({ className, size, ...props }: LoadingSpinnerProps) => {
  return (
    <LoaderCircle
      className={cn(loadingVariants({ className, size }))}
      {...props}
    />
  );
};
LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };
