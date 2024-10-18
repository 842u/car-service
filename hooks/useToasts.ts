import { useCallback, useState } from 'react';

import { Toast, ToastType } from '@/types';

export function useToasts() {
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

  return { toasts, addToast, removeToast };
}
