import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import {
  deleteCarOwnershipsByUsersIds,
  updateCarPrimaryOwnershipByUserId,
} from '@/lib/supabase/tables/cars_ownerships';
import {
  carsOwnershipsDeleteOnMutate,
  carsOwnershipsUpdateOnError,
  carsOwnershipsUpdateOnMutate,
} from '@/lib/tanstack/cars_ownerships';
import { queryKeys } from '@/lib/tanstack/keys';
import type { CarOwnership } from '@/types';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { useDropdown } from '@/ui/dropdown/dropdown';
import { queryKeys as userQueryKeys } from '@/user/infrastructure/tanstack/query/keys';

interface MutationVariables {
  carId: string;
  ownerId: string;
  queryClient: QueryClient;
  username?: string | null;
  sessionUserId?: string;
}

interface UseDropdownContentParams {
  ownership: CarOwnership;
  username?: string | null;
  sessionUserId?: string;
}

export function useDropdownContent({
  ownership,
  username,
  sessionUserId,
}: UseDropdownContentParams) {
  const { close } = useDropdown();
  const { addToast } = useToasts();

  const deleteModalRef = useRef<DialogModalRef>(null);
  const promoteModalRef = useRef<DialogModalRef>(null);

  const router = useRouter();

  const { mutate: mutateDelete } = useMutation({
    throwOnError: false,
    mutationFn: ({ carId, ownerId }: MutationVariables) =>
      deleteCarOwnershipsByUsersIds(carId, [ownerId]),
    onMutate: ({ carId, ownerId, queryClient }) =>
      carsOwnershipsDeleteOnMutate([ownerId], queryClient, carId),
    onSuccess: (_, { username }) =>
      addToast(`Owner ${username} removed.`, 'success'),
    onError: (error, { carId, queryClient }, context) => {
      addToast(error.message, 'error');
      queryClient.setQueryData(
        queryKeys.carsOwnershipsByCarId(carId),
        context?.previousQueryData,
      );
    },
    onSettled: (_, __, { queryClient, carId, ownerId, sessionUserId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.carsOwnershipsByCarId(carId),
      });

      if (sessionUserId === ownerId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.carsInfinite,
        });
      }

      queryClient.invalidateQueries({
        queryKey: userQueryKeys.usersByContext({ carId }),
      });
    },
  });

  const { mutate: mutateUpdate } = useMutation({
    throwOnError: false,
    mutationFn: ({ carId, ownerId }: MutationVariables) =>
      updateCarPrimaryOwnershipByUserId(carId, ownerId),
    onMutate: ({ queryClient, carId, ownerId }) =>
      carsOwnershipsUpdateOnMutate(queryClient, carId, ownerId),
    onSuccess: (_, { username }) =>
      addToast(`Owner ${username} promoted.`, 'success'),
    onError: (error, { queryClient, carId }, context) => {
      addToast(error.message, 'error');
      carsOwnershipsUpdateOnError(queryClient, context, carId);
    },
    onSettled: (_, __, { queryClient, carId }) =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.carsOwnershipsByCarId(carId),
      }),
  });

  const queryClient = useQueryClient();

  const carId = ownership.car_id;

  const ownerId = ownership.owner_id;

  const handleDeleteButtonClick = () => {
    deleteModalRef.current?.showModal();
    close();
  };

  const handleDeleteModalCancel = () => deleteModalRef.current?.closeModal();

  const handleDeleteModalConfirm = () => {
    deleteModalRef.current?.closeModal();

    if (sessionUserId === ownerId) {
      router.replace('/dashboard/cars' satisfies Route);
    }

    mutateDelete({
      sessionUserId,
      carId,
      ownerId,
      username,
      queryClient,
    });
  };

  const handlePromoteButtonClick = () => {
    promoteModalRef.current?.showModal();
    close();
  };

  const handlePromoteModalCancel = () => promoteModalRef.current?.closeModal();

  const handlePromoteModalConfirm = () => {
    promoteModalRef.current?.closeModal();

    mutateUpdate({
      carId,
      ownerId,
      username,
      queryClient,
    });
  };

  return {
    handleDeleteButtonClick,
    handleDeleteModalCancel,
    handleDeleteModalConfirm,
    handlePromoteButtonClick,
    handlePromoteModalCancel,
    handlePromoteModalConfirm,
    deleteModalRef,
    promoteModalRef,
    selfDeletion: sessionUserId === ownerId,
  };
}
