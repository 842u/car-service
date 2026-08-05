import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeys } from '@/car/service-log/presentation/tanstack/query/keys';
import { getServiceLogsQueryOptions } from '@/car/service-log/presentation/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key-serialize';

export function useCostsSection() {
  const { addToast } = useToasts();

  const { data, isError, error, isPending } = useQuery(
    getServiceLogsQueryOptions(),
  );

  useEffect(() => {
    isError &&
      addToast(
        error?.message || 'Cannot get service logs costs.',
        'error',
        queryKeySerialize(queryKeys.all()),
      );
  }, [isError, error, addToast]);

  return { serviceLogs: data, isPending };
}
