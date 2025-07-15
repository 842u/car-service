import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { EllipsisIcon } from '@/components/decorative/icons/EllipsisIcon';
import { useToasts } from '@/hooks/useToasts';
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

import { OwnershipDeleteModal } from '../../modals/OwnershipDeleteModal/OwnershipDeleteModal';
import { OwnershipPromoteModal } from '../../modals/OwnershipPromoteModal/OwnershipPromoteModal';
import { Button } from '../../shared/base/Button/Button';
import { DialogModalRef } from '../../shared/base/DialogModal/DialogModal';
import { Dropdown } from '../../shared/base/Dropdown/Dropdown';
import { IconButton } from '../../shared/IconButton/IconButton';

type CarOwnershipsTableActionsDropdownProps = {
  isCurrentUserPrimaryOwner: boolean;
  ownership: CarOwnership;
  ownerUsername?: string | null;
  userId?: string;
  collisionDetectionRoot?: HTMLElement | null;
};

export function CarOwnershipsTableActionsDropdown({
  isCurrentUserPrimaryOwner,
  ownership,
  ownerUsername,
  collisionDetectionRoot,
  userId,
}: CarOwnershipsTableActionsDropdownProps) {
  const ownershipDeleteModalRef = useRef<DialogModalRef>(null);
  const ownershipPromoteModalRef = useRef<DialogModalRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const carId = ownership.car_id;

  const { mutate: mutateDelete } = useMutation({
    throwOnError: false,
    mutationFn: ({
      carId,
      ownerId,
    }: {
      carId: string;
      ownerId: string;
      ownerUsername?: string | null;
    }) => deleteCarOwnershipsByUsersIds(carId, [ownerId]),
    onMutate: ({ carId, ownerId }) =>
      carsOwnershipsDeleteOnMutate([ownerId], queryClient, carId),
    onSuccess: (_, variables) =>
      addToast(`Owner ${variables.ownerUsername} removed.`, 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      queryClient.setQueryData(
        queryKeys.carsOwnershipsByCarId(carId),
        context?.previousQueryData,
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.carsOwnershipsByCarId(carId),
      }),
  });

  const { mutate: mutateUpdate } = useMutation({
    throwOnError: false,
    mutationFn: ({
      carId,
      ownerId,
    }: {
      carId: string;
      ownerId: string;
      ownerUsername?: string | null;
    }) => updateCarPrimaryOwnershipByUserId(carId, ownerId),
    onMutate: ({ carId, ownerId }) =>
      carsOwnershipsUpdateOnMutate(queryClient, carId, ownerId),
    onSuccess: (_, variables) =>
      addToast(`Owner ${variables.ownerUsername} promoted.`, 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      carsOwnershipsUpdateOnError(queryClient, context, carId);
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.carsOwnershipsByCarId(carId),
      }),
  });

  const handleActionDeleteButtonClick = () =>
    ownershipDeleteModalRef.current?.showModal();

  const handleOwnershipDeleteModalCancel = () =>
    ownershipDeleteModalRef.current?.closeModal();

  const handleOwnershipDeleteModalConfirm = () => {
    ownershipDeleteModalRef.current?.closeModal();

    mutateDelete({ carId, ownerId: ownership.owner_id, ownerUsername });
  };

  const handlePromoteActionButtonClick = () =>
    ownershipPromoteModalRef.current?.showModal();

  const handleOwnershipPromoteModalCancel = () =>
    ownershipPromoteModalRef.current?.closeModal();

  const handleOwnershipPromoteModalConfirm = () => {
    ownershipPromoteModalRef.current?.closeModal();

    mutateUpdate({ carId, ownerId: ownership.owner_id, ownerUsername });
  };

  const canPromote = isCurrentUserPrimaryOwner && userId !== ownership.owner_id;

  const canDelete =
    (isCurrentUserPrimaryOwner && userId !== ownership.owner_id) ||
    (!isCurrentUserPrimaryOwner && userId === ownership.owner_id);

  const canTakeAction = canPromote || canDelete;

  return (
    <Dropdown className="w-12" collisionDetectionRoot={collisionDetectionRoot}>
      <Dropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            className="group"
            disabled={!canTakeAction}
            title="Actions"
            variant="transparent"
            onClick={onClick}
          >
            <EllipsisIcon className="fill-dark-500 stroke-dark-500 dark:fill-light-500 dark:stroke-light-500 group-disabled:dark:fill-alpha-grey-500 group-disabled:dark:stroke-alpha-grey-500 group-disabled:fill-alpha-grey-500 group-disabled:stroke-alpha-grey-500 w-full px-1" />
          </IconButton>
        )}
      </Dropdown.Trigger>
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
    </Dropdown>
  );
}
