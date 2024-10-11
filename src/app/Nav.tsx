'use client';

import useAppContext from 'hooks/useAppContext';
import { UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function Nav() {
  const { auth } = useAppContext();

  return (
    <nav className="flex justify-between items-center w-full h-[50px] px-4 bg-slate-300">
      <div className="text-xl">
        <Link href="/">book prompts</Link>
      </div>
      <div className="flex gap-4 items-center">
        {auth.isLoggedIn ? <div>{auth.email}</div> : <UserIcon size={18} />}
      </div>
    </nav>
  );
}
