'use client';

import { ReactNode, useMemo } from 'react';

import { ToastsContext, ToastsContextType } from '@/context/ToastsContext';
import { useToasts } from '@/hooks/useToasts';

type ToastsProviderProps = {
  children: ReactNode;
};

export function ToastsProvider({ children }: ToastsProviderProps) {
  const { toasts, addToast, removeToast } = useToasts();

  const value = useMemo<ToastsContextType>(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast],
  );

  return (
    <ToastsContext.Provider value={value}>{children}</ToastsContext.Provider>
  );
}
