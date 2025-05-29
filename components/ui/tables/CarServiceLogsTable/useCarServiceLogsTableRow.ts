import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { useToasts } from '@/hooks/useToasts';
import { deleteServiceLogById } from '@/utils/supabase/tables/service_logs';
import { queryKeys } from '@/utils/tanstack/keys';
import {
  serviceLogsByCarIdDeleteOnError,
  serviceLogsByCarIdDeleteOnMutate,
} from '@/utils/tanstack/service_logs';

import { DialogModalRef } from '../../shared/base/DialogModal/DialogModal';
import { CarServiceLogsTableRowProps } from './CarServiceLogsTableRow';

export function useCarServiceLogsTableRow({
  carId,
  serviceLog,
}: CarServiceLogsTableRowProps) {
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

  const handleConfirmDeleteServiceLogButtonClick = () =>
    mutate(serviceLog.id, {
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.serviceLogsByCarId(carId),
        }),
    });

  return {
    handleEditLogButtonClick,
    handleCarServiceLogEditFormSubmit,
    handleDeleteServiceLogButtonClick,
    handleCancelDeleteServiceLogButtonClick,
    handleConfirmDeleteServiceLogButtonClick,
    editDialogModalRef,
    deleteDialogModalRef,
  };
}
