import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { DeleteModal } from '@/car/ownership/ui/modals/delete/delete';
import { PromoteModal } from '@/car/ownership/ui/modals/promote/promote';
import { useToasts } from '@/common/hooks/use-toasts';
import type { CarOwnership } from '@/types';
import { Button } from '@/ui/button/button';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { Dropdown } from '@/ui/dropdown/dropdown';
import {
  deleteCarOwnershipsByUsersIds,
  updateCarPrimaryOwnershipByUserId,
} from '@/utils/supabase/tables/cars_ownerships';
import {
  carsOwnershipsDeleteOnMutate,
  carsOwnershipsUpdateOnError,
  carsOwnershipsUpdateOnMutate,
} from '@/utils/tanstack/cars_ownerships';
import { queryKeys } from '@/utils/tanstack/keys';

export type DropdownContentProps = {
  ownership: CarOwnership;
  canPromote: boolean;
  canDelete: boolean;
  ownerUsername?: string | null;
  userId?: string;
};

type MutationVariables = {
  carId: string;
  ownerId: string;
  queryClient: QueryClient;
  ownerUsername?: string | null;
  userId?: string;
};

export function DropdownContent({
  ownership,
  canDelete,
  canPromote,
  ownerUsername,
  userId,
}: DropdownContentProps) {
  const deleteModalRef = useRef<DialogModalRef>(null);
  const promoteModalRef = useRef<DialogModalRef>(null);

  const router = useRouter();

  const { addToast } = useToasts();

  const { mutate: mutateDelete } = useMutation({
    throwOnError: false,
    mutationFn: ({ carId, ownerId }: MutationVariables) =>
      deleteCarOwnershipsByUsersIds(carId, [ownerId]),
    onMutate: ({ carId, ownerId, queryClient }) =>
      carsOwnershipsDeleteOnMutate([ownerId], queryClient, carId),
    onSuccess: (_, { ownerUsername }) =>
      addToast(`Owner ${ownerUsername} removed.`, 'success'),
    onError: (error, { carId, queryClient }, context) => {
      addToast(error.message, 'error');
      queryClient.setQueryData(
        queryKeys.carsOwnershipsByCarId(carId),
        context?.previousQueryData,
      );
    },
    onSettled: (_, __, { queryClient, carId, ownerId, userId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.carsOwnershipsByCarId(carId),
      });

      if (userId === ownerId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.infiniteCars,
        });
      }
    },
  });

  const queryClient = useQueryClient();

  const { mutate: mutateUpdate } = useMutation({
    throwOnError: false,
    mutationFn: ({ carId, ownerId }: MutationVariables) =>
      updateCarPrimaryOwnershipByUserId(carId, ownerId),
    onMutate: ({ queryClient, carId, ownerId }) =>
      carsOwnershipsUpdateOnMutate(queryClient, carId, ownerId),
    onSuccess: (_, { ownerUsername }) =>
      addToast(`Owner ${ownerUsername} promoted.`, 'success'),
    onError: (error, { queryClient, carId }, context) => {
      addToast(error.message, 'error');
      carsOwnershipsUpdateOnError(queryClient, context, carId);
    },
    onSettled: (_, __, { queryClient, carId }) =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.carsOwnershipsByCarId(carId),
      }),
  });

  const carId = ownership.car_id;

  const ownerId = ownership.owner_id;

  const handleDeleteButtonClick = () => deleteModalRef.current?.showModal();

  const handleDeleteModalCancel = () => deleteModalRef.current?.closeModal();

  const handleDeleteModalConfirm = () => {
    deleteModalRef.current?.closeModal();

    if (userId === ownerId) {
      router.replace('/dashboard/cars' satisfies Route);
    }

    mutateDelete({
      userId,
      carId,
      ownerId,
      ownerUsername,
      queryClient,
    });
  };

  const handlePromoteButtonClick = () => promoteModalRef.current?.showModal();

  const handlePromoteModalCancel = () => promoteModalRef.current?.closeModal();

  const handlePromoteModalConfirm = () => {
    promoteModalRef.current?.closeModal();

    mutateUpdate({
      carId,
      ownerId,
      ownerUsername,
      queryClient,
    });
  };

  return (
    <Dropdown.Content collisionDetection align="end" side="bottom">
      <Button
        className="w-full"
        disabled={!canPromote}
        variant="transparent"
        onClick={handlePromoteButtonClick}
      >
        Promote
      </Button>
      <PromoteModal
        ref={promoteModalRef}
        canTakeAction={canPromote}
        ownerUsername={ownerUsername}
        onCancel={handlePromoteModalCancel}
        onConfirm={handlePromoteModalConfirm}
      />
      <Button
        className="w-full"
        disabled={!canDelete}
        variant="transparentError"
        onClick={handleDeleteButtonClick}
      >
        Delete
      </Button>
      <DeleteModal
        ref={deleteModalRef}
        canTakeAction={canDelete}
        ownership={ownership}
        ownerUsername={ownerUsername}
        userId={userId}
        onCancel={handleDeleteModalCancel}
        onConfirm={handleDeleteModalConfirm}
      />
    </Dropdown.Content>
  );
}
