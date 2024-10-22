import { hash } from 'crypto';

export function isbnHash({
  authors,
  title,
}: {
  authors: string[];
  title: string;
}): string {
  return hash('sha256', `${title} ${authors.join(' ')}`);
}
