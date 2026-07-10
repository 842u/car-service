import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { queryKeys as carQueryKeys } from '@/car/infrastructure/tanstack/query/keys';
import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { ownershipRemoveMutationOptions } from '@/car/ownership/infrastructure/tanstack/mutation-options/remove';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { updateCarPrimaryOwnershipByUserId } from '@/lib/supabase/tables/cars_ownerships';
import {
  carsOwnershipsUpdateOnError,
  carsOwnershipsUpdateOnMutate,
} from '@/lib/tanstack/cars_ownerships';
import { queryKeys } from '@/lib/tanstack/keys';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { useDropdown } from '@/ui/dropdown/dropdown';

interface MutationVariables {
  carId: string;
  ownerId: string;
  queryClient: QueryClient;
  username?: string | null;
}

interface UseDropdownContentParams {
  ownership: OwnershipDto;
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

  const queryClient = useQueryClient();

  const { mutate: mutateDelete } = useMutation(
    ownershipRemoveMutationOptions(queryClient),
  );

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

  const carId = ownership.carId;

  const ownerId = ownership.ownerId;

  const selfDeletion = sessionUserId === ownerId;

  const handleDeleteButtonClick = () => {
    deleteModalRef.current?.showModal();
    close();
  };

  const handleDeleteModalCancel = () => deleteModalRef.current?.closeModal();

  const handleDeleteModalConfirm = () => {
    deleteModalRef.current?.closeModal();

    if (selfDeletion) {
      queryClient.invalidateQueries({ queryKey: carQueryKeys.carsInfinite });
      router.replace('/dashboard/cars' satisfies Route);
    }

    mutateDelete(
      { carId, ownerId },
      {
        onSuccess: () => addToast(`Owner ${username} removed.`, 'success'),
        onError: (error) => addToast(error.message, 'error'),
      },
    );
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
    selfDeletion,
  };
}
