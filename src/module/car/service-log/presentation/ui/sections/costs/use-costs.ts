import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getServiceLogsQueryOptions } from '@/car/service-log/infrastructure/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';

export function useCostsSection() {
  const { addToast } = useToasts();

  const { data, isError, error, isPending } = useQuery(
    getServiceLogsQueryOptions(),
  );

  useEffect(() => {
    isError &&
      addToast(error?.message || 'Cannot get service logs costs.', 'error');
  }, [isError, error, addToast]);

  return { serviceLogs: data, isPending };
}
