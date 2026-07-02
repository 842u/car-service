import { createContext } from 'react';

import type { Toast, ToastType } from '@/ui/toaster/toast/toast';

export type ToastsContextType = {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, dedupeKey?: string) => void;
  removeToast: (id: string) => void;
};

export const ToastsContext = createContext<ToastsContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});
