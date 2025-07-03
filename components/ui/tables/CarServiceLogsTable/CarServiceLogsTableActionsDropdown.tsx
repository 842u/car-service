import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { EllipsisIcon } from '@/components/decorative/icons/EllipsisIcon';
import { useToasts } from '@/hooks/useToasts';
import { ServiceLog } from '@/types';
import { deleteServiceLogById } from '@/utils/supabase/tables/service_logs';
import { queryKeys } from '@/utils/tanstack/keys';
import {
  serviceLogsByCarIdDeleteOnError,
  serviceLogsByCarIdDeleteOnMutate,
} from '@/utils/tanstack/service_logs';

import { CarServiceLogEditForm } from '../../forms/CarServiceLogEditForm/CarServiceLogEditForm';
import { Button } from '../../shared/base/Button/Button';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { Dropdown } from '../../shared/base/Dropdown/Dropdown';
import { IconButton } from '../../shared/IconButton/IconButton';

type CarServiceLogsTableActionsDropdownProps = {
  carId: string;
  serviceLog: ServiceLog;
  isCurrentUserPrimaryOwner: boolean;
  userId?: string;
  className?: string;
  collisionDetectionRoot?: HTMLElement | null;
};

export function CarServiceLogsTableActionsDropdown({
  carId,
  userId,
  serviceLog,
  isCurrentUserPrimaryOwner,
  collisionDetectionRoot,
  className,
}: CarServiceLogsTableActionsDropdownProps) {
  const editDialogModalRef = useRef<DialogModalRef>(null);
  const deleteDialogModalRef = useRef<DialogModalRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (serviceLogId: string) => deleteServiceLogById(serviceLogId),
    onMutate: (serviceLogId: string) =>
      serviceLogsByCarIdDeleteOnMutate(carId, serviceLogId, queryClient),
    onError: (error, _, context) => {
      serviceLogsByCarIdDeleteOnError(context, carId, queryClient);
      addToast(error.message, 'error');
    },
    onSuccess: () => addToast('Service log deleted successfully.', 'success'),
  });

  const handleEditLogButtonClick = () =>
    editDialogModalRef.current?.showModal();

  const handleCarServiceLogEditFormSubmit = () =>
    editDialogModalRef.current?.closeModal();

  const handleDeleteServiceLogButtonClick = () =>
    deleteDialogModalRef.current?.showModal();

  const handleCancelDeleteServiceLogButtonClick = () =>
    deleteDialogModalRef.current?.closeModal();

  const handleConfirmDeleteServiceLogButtonClick = () => {
    deleteDialogModalRef.current?.closeModal();
    mutate(serviceLog.id, {
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.serviceLogsByCarId(carId),
        }),
    });
  };

  const canTakeAction =
    isCurrentUserPrimaryOwner || userId === serviceLog.created_by;

  return (
    <Dropdown
      className={className}
      collisionDetectionRoot={collisionDetectionRoot}
    >
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
            <EllipsisIcon className="fill-dark-500 dark:fill-light-500 group-disabled:dark:fill-alpha-grey-500 group-disabled:dark:stroke-alpha-grey-500 group-disabled:fill-alpha-grey-500 group-disabled:stroke-alpha-grey-500 w-full px-1" />
          </IconButton>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content side="left">
        <Button
          className="w-full"
          disabled={!canTakeAction}
          variant="transparent"
          onClick={handleEditLogButtonClick}
        >
          Edit
        </Button>
        <DialogModal ref={editDialogModalRef} headingText="Edit service log">
          <CarServiceLogEditForm
            carId={carId}
            serviceLog={serviceLog}
            onSubmit={handleCarServiceLogEditFormSubmit}
          />
        </DialogModal>
        <Button
          disabled={!canTakeAction}
          variant="transparentError"
          onClick={handleDeleteServiceLogButtonClick}
        >
          Delete
        </Button>
        <DialogModal
          ref={deleteDialogModalRef}
          headingText="Delete service log"
        >
          <p className="my-4">Are you sure you want to delete service log?</p>
          <div className="flex w-full flex-col gap-4 md:flex-row md:justify-end md:px-4">
            <Button onClick={handleCancelDeleteServiceLogButtonClick}>
              Cancel
            </Button>
            <Button
              disabled={!canTakeAction}
              variant="error"
              onClick={handleConfirmDeleteServiceLogButtonClick}
            >
              Delete
            </Button>
          </div>
        </DialogModal>
      </Dropdown.Content>
    </Dropdown>
  );
}
