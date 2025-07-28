import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { useToasts } from '@/features/common/hooks/use-toasts';
import { Button } from '@/features/common/ui/button/button';
import { DialogModalRef } from '@/features/common/ui/dialog-modal/dialog-modal';
import { Dropdown } from '@/features/common/ui/dropdown/dropdown';
import { CarOwnership } from '@/types';
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

import { OwnershipDeleteModal } from '../../../OwnershipDeleteModal/OwnershipDeleteModal';
import { OwnershipPromoteModal } from '../../../OwnershipPromoteModal/OwnershipPromoteModal';

export type CarOwnershipsTableActionsDropdownContentProps = {
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

export function CarOwnershipsTableActionsDropdownContent({
  ownership,
  canDelete,
  canPromote,
  ownerUsername,
  userId,
}: CarOwnershipsTableActionsDropdownContentProps) {
  const ownershipDeleteModalRef = useRef<DialogModalRef>(null);
  const ownershipPromoteModalRef = useRef<DialogModalRef>(null);

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

  const handleActionDeleteButtonClick = () =>
    ownershipDeleteModalRef.current?.showModal();

  const handleOwnershipDeleteModalCancel = () =>
    ownershipDeleteModalRef.current?.closeModal();

  const handleOwnershipDeleteModalConfirm = () => {
    ownershipDeleteModalRef.current?.closeModal();

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

  const handlePromoteActionButtonClick = () =>
    ownershipPromoteModalRef.current?.showModal();

  const handleOwnershipPromoteModalCancel = () =>
    ownershipPromoteModalRef.current?.closeModal();

  const handleOwnershipPromoteModalConfirm = () => {
    ownershipPromoteModalRef.current?.closeModal();

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
        onClick={handlePromoteActionButtonClick}
      >
        Promote
      </Button>
      <OwnershipPromoteModal
        ref={ownershipPromoteModalRef}
        canTakeAction={canPromote}
        ownerUsername={ownerUsername}
        onCancel={handleOwnershipPromoteModalCancel}
        onConfirm={handleOwnershipPromoteModalConfirm}
      />
      <Button
        className="w-full"
        disabled={!canDelete}
        variant="transparentError"
        onClick={handleActionDeleteButtonClick}
      >
        Delete
      </Button>
      <OwnershipDeleteModal
        ref={ownershipDeleteModalRef}
        canTakeAction={canDelete}
        ownership={ownership}
        ownerUsername={ownerUsername}
        userId={userId}
        onCancel={handleOwnershipDeleteModalCancel}
        onConfirm={handleOwnershipDeleteModalConfirm}
      />
    </Dropdown.Content>
  );
}
