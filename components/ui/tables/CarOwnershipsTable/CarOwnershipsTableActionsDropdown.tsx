import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { EllipsisIcon } from '@/components/decorative/icons/EllipsisIcon';
import { useToasts } from '@/hooks/useToasts';
import { CarOwnership } from '@/types';
import { deleteCarOwnershipsByUsersIds } from '@/utils/supabase/tables/cars_ownerships';
import { carsOwnershipsDeleteOnMutate } from '@/utils/tanstack/cars_ownerships';
import { queryKeys } from '@/utils/tanstack/keys';

import { Button } from '../../shared/base/Button/Button';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { Dropdown } from '../../shared/base/Dropdown/Dropdown';
import { IconButton } from '../../shared/IconButton/IconButton';

type CarOwnershipsTableActionsDropdownProps = {
  isCurrentUserPrimaryOwner: boolean;
  ownership: CarOwnership;
  ownerUsername?: string | null;
  userId?: string;
};

export function CarOwnershipsTableActionsDropdown({
  isCurrentUserPrimaryOwner,
  ownership,
  ownerUsername,
  userId,
}: CarOwnershipsTableActionsDropdownProps) {
  const deleteDialogModalRef = useRef<DialogModalRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const carId = ownership.car_id;

  const { mutate } = useMutation({
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
      addToast(
        `Successfully removed ${variables.ownerUsername} ownership.`,
        'success',
      ),
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

  const handleDeleteActionButtonClick = () =>
    deleteDialogModalRef.current?.showModal();

  const handleDeleteDialogModalCancelButtonClick = () =>
    deleteDialogModalRef.current?.closeModal();

  const handleDeleteDialogModalDeleteButtonClick = () => {
    deleteDialogModalRef.current?.closeModal();
    mutate({ carId, ownerId: ownership.owner_id, ownerUsername });
  };

  const canPromote = isCurrentUserPrimaryOwner && userId !== ownership.owner_id;

  const canDelete =
    (isCurrentUserPrimaryOwner && userId !== ownership.owner_id) ||
    (!isCurrentUserPrimaryOwner && userId === ownership.owner_id);

  const canTakeAction = canPromote || canDelete;

  return (
    <Dropdown className="w-12">
      <Dropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            disabled={!canTakeAction}
            title="Actions"
            variant="transparent"
            onClick={onClick}
          >
            {canTakeAction ? (
              <EllipsisIcon className="fill-accent-700 stroke-accent-700 dark:fill-accent-400 dark:stroke-accent-400 w-full px-1" />
            ) : (
              <EllipsisIcon className="fill-alpha-grey-500 stroke-alpha-grey-500 w-full px-1" />
            )}
          </IconButton>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content snap="bottom-right">
        <Button className="w-full" disabled={!canPromote} variant="transparent">
          Promote
        </Button>
        <Button
          className="w-full"
          disabled={!canDelete}
          variant="error"
          onClick={handleDeleteActionButtonClick}
        >
          Delete
        </Button>
        <DialogModal ref={deleteDialogModalRef} headingText="Delete ownership">
          {userId === ownership.owner_id ? (
            <p className="my-10 max-w-full text-wrap">
              Are you sure you want to delete your ownership?
              <span className="text-warning-400 my-1 block">
                You will lose access to this car after proceeding.
              </span>
            </p>
          ) : (
            <p className="my-10 max-w-full text-wrap">
              Are you sure you want to delete{' '}
              <span className="text-warning-400 mx-1 font-extrabold">
                {ownerUsername}
              </span>{' '}
              ownership?
            </p>
          )}
          <div className="flex w-full flex-col gap-4 md:flex-row md:justify-end md:px-4">
            <Button onClick={handleDeleteDialogModalCancelButtonClick}>
              Cancel
            </Button>
            <Button
              disabled={!canDelete}
              variant="error"
              onClick={handleDeleteDialogModalDeleteButtonClick}
            >
              Delete
            </Button>
          </div>
        </DialogModal>
      </Dropdown.Content>
    </Dropdown>
  );
}
