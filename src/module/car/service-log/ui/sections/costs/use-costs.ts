import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getServiceLogsWithCost } from '@/lib/supabase/tables/service_logs';
import { queryKeys } from '@/lib/tanstack/keys';

export function useCostsSection() {
  const { addToast } = useToasts();

  const { data, isError, error, isPending } = useQuery({
    queryKey: queryKeys.serviceLogsWithCost,
    queryFn: getServiceLogsWithCost,
  });

  useEffect(() => {
    isError &&
      addToast(error?.message || 'Cannot get service logs costs.', 'error');
  }, [isError, error, addToast]);

  return { serviceLogs: data, isPending };
}
