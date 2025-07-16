import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
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

import { ServiceLogDeleteModal } from '../../modals/ServiceLogDeleteModal/ServiceLogDeleteModal';
import { ServiceLogEditModal } from '../../modals/ServiceLogEditModal/ServiceLogEditModal';
import { Button } from '../../shared/base/Button/Button';
import { DialogModalRef } from '../../shared/base/DialogModal/DialogModal';
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

type MutationVariables = {
  carId: string;
  serviceLogId: string;
  queryClient: QueryClient;
};

export function CarServiceLogsTableActionsDropdown({
  carId,
  userId,
  serviceLog,
  isCurrentUserPrimaryOwner,
  collisionDetectionRoot,
  className,
}: CarServiceLogsTableActionsDropdownProps) {
  const serviceLogEditModalRef = useRef<DialogModalRef>(null);
  const serviceLogDeleteModalRef = useRef<DialogModalRef>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ serviceLogId }: MutationVariables) =>
      deleteServiceLogById(serviceLogId),
    onMutate: ({ carId, serviceLogId, queryClient }) =>
      serviceLogsByCarIdDeleteOnMutate(carId, serviceLogId, queryClient),
    onError: (error, { carId, queryClient }, context) => {
      serviceLogsByCarIdDeleteOnError(context, carId, queryClient);
      addToast(error.message, 'error');
    },
    onSuccess: () => addToast('Service log deleted.', 'success'),
  });

  const handleServiceLogEditButtonClick = () =>
    serviceLogEditModalRef.current?.showModal();

  const handleServiceLogEditModalSubmit = () =>
    serviceLogEditModalRef.current?.closeModal();

  const handleServiceLogDeleteButtonClick = () =>
    serviceLogDeleteModalRef.current?.showModal();

  const handleServiceLogModalCancel = () =>
    serviceLogDeleteModalRef.current?.closeModal();

  const handleServiceLogModalConfirm = () => {
    serviceLogDeleteModalRef.current?.closeModal();

    mutate(
      { carId, queryClient, serviceLogId: serviceLog.id },
      {
        onSettled: (_, __, { queryClient, carId }) =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.serviceLogsByCarId(carId),
          }),
      },
    );
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
      <Dropdown.Content collisionDetection align="end" side="bottom">
        <Button
          className="w-full"
          disabled={!canTakeAction}
          variant="transparent"
          onClick={handleServiceLogEditButtonClick}
        >
          Edit
        </Button>
        <ServiceLogEditModal
          ref={serviceLogEditModalRef}
          serviceLog={serviceLog}
          onSubmit={handleServiceLogEditModalSubmit}
        />
        <Button
          disabled={!canTakeAction}
          variant="transparentError"
          onClick={handleServiceLogDeleteButtonClick}
        >
          Delete
        </Button>
        <ServiceLogDeleteModal
          ref={serviceLogDeleteModalRef}
          canTakeAction={canTakeAction}
          onCancel={handleServiceLogModalCancel}
          onConfirm={handleServiceLogModalConfirm}
        />
      </Dropdown.Content>
    </Dropdown>
  );
}
