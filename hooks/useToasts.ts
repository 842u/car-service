import { useContext } from 'react';

import { ToastsContext, ToastsContextType } from '@/context/ToastsContext';

export function useToasts() {
  const { toasts, addToast, removeToast } = useContext(
    ToastsContext,
  ) as ToastsContextType;

  return { toasts, addToast, removeToast };
}
