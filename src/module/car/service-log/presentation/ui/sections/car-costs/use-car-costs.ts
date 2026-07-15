import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeys } from '@/car/service-log/infrastructure/tanstack/query/keys';
import { getServiceLogsByCarIdQueryOptions } from '@/car/service-log/infrastructure/tanstack/query/options';
import { queryKeySerialize } from '@/common/infrastructure/tanstack/query-key';
import { useToasts } from '@/common/presentation/hook/use-toasts';

interface UseCarCostsSectionParams {
  carId: string;
}

export function useCarCostsSection({ carId }: UseCarCostsSectionParams) {
  const { addToast } = useToasts();

  const { data, isError, error, isPending } = useQuery(
    getServiceLogsByCarIdQueryOptions(carId),
  );

  useEffect(() => {
    isError &&
      addToast(
        error?.message || 'Cannot get service logs costs.',
        'error',
        queryKeySerialize(queryKeys.serviceLogsByCarId(carId)),
      );
  }, [isError, error, addToast, carId]);

  return { serviceLogs: data, isPending };
}
