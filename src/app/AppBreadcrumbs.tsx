'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbLinkHome,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { BookHeartIcon, HouseIcon, NotebookPenIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';

function buildBreadcrumb({
  isLast,
  path,
  pathname,
}: {
  isLast: boolean;
  path: string;
  pathname: string;
}) {
  switch (path) {
    case 'prompts':
      if (isLast) {
        return (
          <BreadcrumbPage className="flex items-center gap-2">
            <NotebookPenIcon size={20} /> Prompts
          </BreadcrumbPage>
        );
      } else {
        return (
          <BreadcrumbLink href="/prompts" className="flex items-center gap-2">
            <NotebookPenIcon size={20} /> Prompts
          </BreadcrumbLink>
        );
      }
    default:
      if (isLast) {
        if (pathname.includes('prompts')) {
          if (path === 'new') {
            return <BreadcrumbPage>New</BreadcrumbPage>;
          }
          return (
            <BreadcrumbPage className="flex items-center gap-2">
              <BookHeartIcon size={20} /> Recommendations
            </BreadcrumbPage>
          );
        }
      }
      // unsupported path
      return <></>;
  }
}

export default function AppBreadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2">
              <HouseIcon size={20} /> Home
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const paths = pathname.split('/').filter((path) => path !== '');
  const breadcrumbs = paths.map((path, index) => {
    const isLast = index === paths.length - 1;

    return (
      <React.Fragment key={index}>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {buildBreadcrumb({ isLast, path, pathname })}
        </BreadcrumbItem>
      </React.Fragment>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLinkHome />
        </BreadcrumbItem>
        {breadcrumbs}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
