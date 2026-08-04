import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeys } from '@/car/service-log/presentation/tanstack/query/keys';
import { getServiceLogsByCarIdQueryOptions } from '@/car/service-log/presentation/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key-serialize';

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
        queryKeySerialize(queryKeys.byCarId(carId)),
      );
  }, [isError, error, addToast, carId]);

  return { serviceLogs: data, isPending };
}
