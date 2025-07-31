'use client';

import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import type { ToastsContextType } from '@/features/common/contexts/toasts';
import { ToastsContext } from '@/features/common/contexts/toasts';
import type { Toast, ToastType } from '@/types';

type ToastsProviderProps = {
  children: ReactNode;
};

export function ToastsProvider({ children }: ToastsProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const newToast = {
      id: crypto.randomUUID(),
      message,
      type,
    };

    setToasts((currentToasts) => [...currentToasts, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

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
