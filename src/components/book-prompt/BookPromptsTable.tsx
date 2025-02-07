import DataTable from '@/components/table/DataTable';
import SortableHeader from '@/components/table/SortableHeader';
import { TableCell, TableHead } from '@/components/ui/table';
import BookPromptTable from '@/types/BookPromptTable';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

const getColumns = (linkPathname: string): ColumnDef<BookPromptTable>[] => [
  {
    accessorKey: 'promptText',
    meta: {
      cell: (props) => (
        <TableCell className="p-0 contents">
          <Link
            href={`${linkPathname}/${props.row.id}`}
            className="table-cell align-middle p-2 w-[450px] max-w-[450px]"
          >
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              <>{props.getValue() as string}</>
            </div>
          </Link>
        </TableCell>
      ),
      header: ({ column }) => (
        <TableHead className="w-[450px] max-w-[450px]">
          <SortableHeader
            column={column}
            text="Recommendations for books that..."
            className="justify-start"
            showPlaceholderSortIconSpace={false}
          />
        </TableHead>
      ),
    },
  },
  {
    accessorFn: (bookPrompt) => bookPrompt.promptGenre?.displayName,
    id: 'genre',
    meta: {
      cell: (props) => (
        <TableCell className="p-0 contents">
          <Link
            href={`${linkPathname}/${props.row.id}`}
            className="table-cell align-middle p-2 w-[100px] max-w-[100px]"
          >
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              <>{props.getValue() as string}</>
            </div>
          </Link>
        </TableCell>
      ),
      header: ({ column }) => (
        <TableHead className="w-[100px] max-w-[100px]">
          <SortableHeader
            column={column}
            text="Genre"
            className="justify-start"
            showPlaceholderSortIconSpace={false}
          />
        </TableHead>
      ),
    },
  },
  {
    accessorFn: (bookPrompt) => bookPrompt.promptSubgenre?.displayName,
    id: 'subgenre',
    meta: {
      cell: (props) => (
        <TableCell className="p-0 contents">
          <Link
            href={`${linkPathname}/${props.row.id}`}
            className="table-cell align-middle p-2 w-[100px] max-w-[100px]"
          >
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              <>{props.getValue() as string}</>
            </div>
          </Link>
        </TableCell>
      ),
      header: ({ column }) => (
        <TableHead className="w-[100px] max-w-[100px]">
          <SortableHeader
            column={column}
            text="Subgenre"
            className="justify-start"
            showPlaceholderSortIconSpace={false}
          />
        </TableHead>
      ),
    },
  },
  {
    accessorFn: (bookPrompt) =>
      new Date(bookPrompt.createdAt).toLocaleDateString(),
    cell: (props) => (
      <div className="text-right">
        <>{props.getValue() as string}</>
      </div>
    ),
    header: ({ column }) => <SortableHeader column={column} text="Date" />,
    id: 'date',
  },
];

export default function BookPromptsTable({
  bookPrompts,
  isLoading,
  linkPathname,
}: {
  bookPrompts: BookPromptTable[];
  isLoading?: boolean;
  linkPathname: string;
}) {
  return (
    <DataTable
      columns={getColumns(linkPathname)}
      data={bookPrompts}
      isLoading={isLoading}
      linkPathname={linkPathname}
      noDataText="No prompts found"
    />
  );
}
