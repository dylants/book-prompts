import DataTable from '@/components/table/DataTable';
import SortableHeader from '@/components/table/SortableHeader';
import { BookPromptTable } from '@/types/BookPromptTable';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<BookPromptTable>[] = [
  {
    accessorKey: 'promptText',
    header: ({ column }) => (
      <SortableHeader column={column} text="Prompt" className="justify-start" />
    ),
  },
  {
    accessorFn: (bookPrompt) => bookPrompt.promptGenre?.displayName,
    header: ({ column }) => (
      <SortableHeader column={column} text="Genre" className="justify-start" />
    ),
    id: 'genre',
  },
  {
    accessorFn: (bookPrompt) => bookPrompt.promptSubgenre?.displayName,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        text="Subgenre"
        className="justify-start"
      />
    ),
    id: 'subgenre',
  },
  {
    accessorFn: (bookPrompt) =>
      new Date(bookPrompt.createdAt).toLocaleDateString(),
    cell: (props) => (
      <div className="text-right">
        <>{props.getValue()}</>
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
      columns={columns}
      data={bookPrompts}
      isLoading={isLoading}
      linkPathname={linkPathname}
      noDataText="No prompts found"
    />
  );
}
