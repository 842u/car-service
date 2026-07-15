import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeySerialize } from '@/common/infrastructure/tanstack/query-key';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getSessionUserQueryOptions } from '@/user/infrastructure/tanstack/query/options';

export function useSessionUser() {
  const { addToast } = useToasts();

  const { data, error, isError, isPending } = useQuery(
    getSessionUserQueryOptions,
  );

  useEffect(() => {
    if (!isError) return;

    addToast(
      error.message,
      'error',
      queryKeySerialize(getSessionUserQueryOptions.queryKey),
    );
  }, [isError, addToast, error]);

  return { data, isPending };
}
