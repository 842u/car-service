import type { Context } from 'react';
import { use } from 'react';

type UseContextGuardOptions<T> = {
  context: Context<T | null>;
  componentName: string;
};

export function useContextGuard<T>({
  context,
  componentName,
}: UseContextGuardOptions<T>) {
  const receivedContext = use(context);

  if (!receivedContext)
    throw new Error(
      `${componentName} related components should be wrapped in ${componentName}.`,
    );

  return receivedContext;
}
