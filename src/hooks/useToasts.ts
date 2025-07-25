import { use } from 'react';

import { ToastsContext } from '@/context/ToastsContext';

export function useToasts() {
  const { toasts, addToast, removeToast } = use(ToastsContext);

  return { toasts, addToast, removeToast };
}
