import { Button } from '@/components/ui/button';
import { cn } from '@/lib/tailwind-utils';
import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function SortableHeader<T>({
  className,
  column,
  showPlaceholderSortIconSpace = true,
  text,
}: {
  className?: string;
  column: Column<T>;
  showPlaceholderSortIconSpace?: boolean;
  text: string;
}) {
  const sorted = column.getIsSorted();
  const sortIcon = sorted ? (
    <>
      {sorted === 'asc' ? (
        <ArrowUp className="ml-1 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-1 h-4 w-4" />
      )}
    </>
  ) : showPlaceholderSortIconSpace ? (
    // this acts as a placeholder for the sort icon
    <div className="ml-1 h-4 w-4"></div>
  ) : (
    <></>
  );

  return (
    <Button
      variant="ghost"
      className={cn('flex justify-end w-full px-0 hover:bg-inherit', className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {text}
      {sortIcon}
    </Button>
  );
}
