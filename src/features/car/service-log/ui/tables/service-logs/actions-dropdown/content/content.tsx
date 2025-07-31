import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { DeleteModal } from '@/car/service-log/ui/modals/delete/delete';
import { EditModal } from '@/car/service-log/ui/modals/edit/edit';
import { useToasts } from '@/common/hooks/use-toasts';
import type { ServiceLog } from '@/types';
import { Button } from '@/ui/button/button';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { deleteServiceLogById } from '@/utils/supabase/tables/service_logs';
import { queryKeys } from '@/utils/tanstack/keys';
import {
  serviceLogsByCarIdDeleteOnError,
  serviceLogsByCarIdDeleteOnMutate,
} from '@/utils/tanstack/service_logs';

export type DropdownContentProps = {
  canTakeAction: boolean;
  carId: string;
  serviceLog: ServiceLog;
};

type MutationVariables = {
  carId: string;
  serviceLogId: string;
  queryClient: QueryClient;
};

export function DropdownContent({
  canTakeAction,
  carId,
  serviceLog,
}: DropdownContentProps) {
  const editModalRef = useRef<DialogModalRef>(null);
  const deleteModalRef = useRef<DialogModalRef>(null);

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

  const serviceLogId = serviceLog.id;

  const handleEditButtonClick = () => editModalRef.current?.showModal();

  const handleEditModalSubmit = () => editModalRef.current?.closeModal();

  const handleDeleteButtonClick = () => deleteModalRef.current?.showModal();

  const handleDeleteModalCancel = () => deleteModalRef.current?.closeModal();

  const handleDeleteModalConfirm = () => {
    deleteModalRef.current?.closeModal();

    mutate(
      { carId, queryClient, serviceLogId },
      {
        onSettled: (_, __, { queryClient, carId }) =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.serviceLogsByCarId(carId),
          }),
      },
    );
  };

  return (
    <Dropdown.Content collisionDetection align="end" side="bottom">
      <Button
        className="w-full"
        disabled={!canTakeAction}
        variant="transparent"
        onClick={handleEditButtonClick}
      >
        Edit
      </Button>
      <EditModal
        ref={editModalRef}
        serviceLog={serviceLog}
        onSubmit={handleEditModalSubmit}
      />
      <Button
        disabled={!canTakeAction}
        variant="transparentError"
        onClick={handleDeleteButtonClick}
      >
        Delete
      </Button>
      <DeleteModal
        ref={deleteModalRef}
        canTakeAction={canTakeAction}
        onCancel={handleDeleteModalCancel}
        onConfirm={handleDeleteModalConfirm}
      />
    </Dropdown.Content>
  );
}
