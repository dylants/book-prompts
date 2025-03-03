import { Button } from '@/components/ui/button';
import { NotebookPenIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';

function NavLink({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  const buttonContent = (
    <Button
      variant="outline"
      className="flex flex-col items-center py-0 h-[80px] w-[200px] text-lg"
    >
      {children}
    </Button>
  );

  return (
    <div className="flex items-center">
      <Link href={path}>{buttonContent}</Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col w-full items-center mt-[80px] gap-4">
      <h1>Book Prompts</h1>
      <p>Recommends books based off reading prompts</p>
      <div className="grid grid-cols-2 gap-8">
        <NavLink path="/prompts">
          <NotebookPenIcon size={18} />
          Prompts
        </NavLink>
        <NavLink path="/book-reviews">
          <StarIcon size={18} />
          Book Reviews
        </NavLink>
      </div>
    </div>
  );
}
