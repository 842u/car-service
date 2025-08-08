import { use } from 'react';

import { ToastsContext } from '../contexts/toasts';

export function useToasts() {
  const { toasts, addToast, removeToast } = use(ToastsContext);

  return { toasts, addToast, removeToast };
}
