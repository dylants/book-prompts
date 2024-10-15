import { hash } from 'crypto';

export function isbnHash({
  author,
  title,
}: {
  author: string;
  title: string;
}): string {
  return hash('sha256', `${title} ${author}`);
}
