'use client';

import { ReactNode, useCallback, useMemo, useState } from 'react';

import { ToastsContext } from '@/context/ToastsContext';
import { Toast, ToastType } from '@/types';

type ToastsProviderProps = {
  children: ReactNode;
};

export function ToastsProvider({ children }: ToastsProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType) => {
      const newToast = {
        id: crypto.randomUUID(),
        message,
        type,
      };

      setToasts([...toasts, newToast]);
    },
    [toasts],
  );

  const removeToast = useCallback(
    (id: string) => {
      const filteredToasts = toasts.filter((toast) => toast.id !== id);

      setToasts([...filteredToasts]);
    },
    [toasts],
  );

  const value = useMemo(
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
