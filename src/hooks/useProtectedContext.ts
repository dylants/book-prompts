'use client';

import ProtectedContext, {
  ProtectedContextType,
} from '@/app/(protected)/ProtectedContext';
import { useContext } from 'react';

export default function useProtectedContext(): ProtectedContextType {
  const context = useContext(ProtectedContext);

  if (!context) {
    throw new Error('useProtectedContext used outside of provider');
  }

  return context;
}
