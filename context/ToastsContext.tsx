import { createContext } from 'react';

import { Toast, ToastType } from '@/types';

export type ToastsContextType = {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
};

export const ToastsContext = createContext<ToastsContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});
