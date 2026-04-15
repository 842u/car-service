import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { deleteServiceLogById } from '@/lib/supabase/tables/service_logs';
import { queryKeys } from '@/lib/tanstack/keys';
import {
  serviceLogsByCarIdDeleteOnError,
  serviceLogsByCarIdDeleteOnMutate,
} from '@/lib/tanstack/service_logs';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { useDropdown } from '@/ui/dropdown/dropdown';

interface MutationVariables {
  carId: string;
  serviceLogId: string;
  queryClient: QueryClient;
}

interface UseDropdownContentParams {
  carId: string;
  serviceLogId: string;
}

export function useDropdownContent({
  carId,
  serviceLogId,
}: UseDropdownContentParams) {
  const { close } = useDropdown();
  const { addToast } = useToasts();

  const editModalRef = useRef<DialogModalRef>(null);
  const deleteModalRef = useRef<DialogModalRef>(null);

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

  const handleEditButtonClick = () => {
    editModalRef.current?.showModal();
    close();
  };

  const handleEditModalSubmit = () => editModalRef.current?.closeModal();

  const handleDeleteButtonClick = () => {
    deleteModalRef.current?.showModal();
    close();
  };

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

  return {
    editModalRef,
    deleteModalRef,
    handleEditButtonClick,
    handleEditModalSubmit,
    handleDeleteButtonClick,
    handleDeleteModalCancel,
    handleDeleteModalConfirm,
  };
}
