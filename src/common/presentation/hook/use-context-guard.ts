import type { Context } from 'react';
import { use } from 'react';

type UseContextGuardParams<TValue> = {
  context: Context<TValue | null>;
  componentName: string;
};

export function useContextGuard<TValue>({
  context,
  componentName,
}: UseContextGuardParams<TValue>) {
  const receivedContext = use(context);

  if (!receivedContext)
    throw new Error(
      `${componentName} related components should be wrapped in ${componentName}.`,
    );

  return receivedContext;
}
