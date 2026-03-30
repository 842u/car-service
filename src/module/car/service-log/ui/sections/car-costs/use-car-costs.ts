import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getServiceLogsWithCostByCarId } from '@/lib/supabase/tables/service_logs';
import { queryKeys } from '@/lib/tanstack/keys';

interface UseCarCostsSectionParams {
  carId: string;
}

export function useCarCostsSection({ carId }: UseCarCostsSectionParams) {
  const { addToast } = useToasts();

  const { data, isError, error, isPending } = useQuery({
    queryKey: queryKeys.serviceLogsWithCostByCarId(carId),
    queryFn: async () => getServiceLogsWithCostByCarId(carId),
  });

  useEffect(() => {
    isError &&
      addToast(error?.message || 'Cannot get service logs costs.', 'error');
  }, [isError, error, addToast]);

  return { serviceLogs: data, isPending };
}
