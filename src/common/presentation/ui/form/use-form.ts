import { createContext } from 'react';

import { useContextGuard } from '@/common/presentation/hook/use-context-guard';

type FormContextValue = true;

export const FormContext = createContext<FormContextValue | null>(null);

export function useForm() {
  return useContextGuard({
    context: FormContext,
    componentName: 'Form',
  });
}
