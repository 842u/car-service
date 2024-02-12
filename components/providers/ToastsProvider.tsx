'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

export type ToastType = 'info' | 'success' | 'error' | 'warning';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

export type ToastsContextType = {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
};

type ToastsProviderProps = {
  children: ReactNode;
};

export const ToastsContext = createContext<ToastsContextType | null>(null);

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
