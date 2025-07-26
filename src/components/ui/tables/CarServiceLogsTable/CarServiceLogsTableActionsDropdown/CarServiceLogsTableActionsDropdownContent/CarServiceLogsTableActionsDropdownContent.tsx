import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRef } from 'react';

import { ServiceLogDeleteModal } from '@/components/ui/modals/ServiceLogDeleteModal/ServiceLogDeleteModal';
import { ServiceLogEditModal } from '@/components/ui/modals/ServiceLogEditModal/ServiceLogEditModal';
import { Button } from '@/components/ui/shared/base/Button/Button';
import { DialogModalRef } from '@/components/ui/shared/base/DialogModal/DialogModal';
import { Dropdown } from '@/components/ui/shared/base/Dropdown/Dropdown';
import { useToasts } from '@/features/common/hooks/useToasts';
import { ServiceLog } from '@/types';
import { deleteServiceLogById } from '@/utils/supabase/tables/service_logs';
import { queryKeys } from '@/utils/tanstack/keys';
import {
  serviceLogsByCarIdDeleteOnError,
  serviceLogsByCarIdDeleteOnMutate,
} from '@/utils/tanstack/service_logs';

export type CarServiceLogsTableActionsDropdownContentProps = {
  canTakeAction: boolean;
  carId: string;
  serviceLog: ServiceLog;
};

type MutationVariables = {
  carId: string;
  serviceLogId: string;
  queryClient: QueryClient;
};

export function CarServiceLogsTableActionsDropdownContent({
  canTakeAction,
  carId,
  serviceLog,
}: CarServiceLogsTableActionsDropdownContentProps) {
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

  const serviceLogId = serviceLog.id;

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
  );
}
