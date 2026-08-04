import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { queryKeys as ownershipQueryKeys } from '@/car/ownership/presentation/tanstack/query/keys';
import { getOwnershipsByCarIdQueryOptions } from '@/car/ownership/presentation/tanstack/query/options';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { getCarByIdQueryOptions } from '@/car/presentation/tanstack/query/options';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { queryKeySerialize } from '@/common/presentation/tanstack/query-key';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

type UseDetailsSectionParams = {
  carId: string;
};

export function useDetailsSection({ carId }: UseDetailsSectionParams) {
  const { data: sessionUser } = useSessionUser();

  const { addToast } = useToasts();

  const {
    data: carData,
    error: carError,
    isLoading: isCarDataLoading,
  } = useQuery(getCarByIdQueryOptions(carId));

  const { data: ownerships, error: ownershipsError } = useQuery(
    getOwnershipsByCarIdQueryOptions(carId),
  );

  useEffect(() => {
    carError &&
      addToast(
        carError.message,
        'error',
        queryKeySerialize(queryKeys.byId(carId)),
      );
  }, [addToast, carError, carId]);

  useEffect(() => {
    ownershipsError &&
      addToast(
        ownershipsError.message,
        'error',
        queryKeySerialize(ownershipQueryKeys.byCarId(carId)),
      );
  }, [addToast, ownershipsError, carId]);

  const isSessionUserPrimaryOwner = !!ownerships?.find(
    (ownership) => ownership.ownerId === sessionUser?.id && ownership.isPrimary,
  );

  return { carData, isCarDataLoading, isSessionUserPrimaryOwner };
}
