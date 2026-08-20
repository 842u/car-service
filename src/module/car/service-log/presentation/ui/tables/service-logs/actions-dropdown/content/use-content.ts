import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';

import { serviceLogRemoveMutationOptions } from '@/car/service-log/presentation/tanstack/mutation/remove';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import type { DialogModalRef } from '@/ui/dialog-modal/use-dialog-modal';
import { useDropdown } from '@/ui/dropdown/use-dropdown';

type UseDropdownContentParams = {
  carId: string;
  serviceLogId: string;
};

export function useDropdownContent({
  carId,
  serviceLogId,
}: UseDropdownContentParams) {
  const { close } = useDropdown();
  const { addToast } = useToasts();

  const editModalRef = useRef<DialogModalRef>(null);
  const deleteModalRef = useRef<DialogModalRef>(null);

  // The dropdown unmounts as soon as the confirm handler fires (the modal
  // closes and, once the cache updates, this row disappears) before the
  // request settles. React Query drops callbacks passed to mutate() once the
  // caller unmounts, so the toast lives on the mutation options (which still
  // run) rather than on the mutate() call. onError is composed so the
  // options' optimistic rollback still runs.
  const { mutate } = useMutation({
    ...serviceLogRemoveMutationOptions,
    onSuccess: () => addToast('Service log deleted.', 'success'),
    onError: (...args) => {
      serviceLogRemoveMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
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

    mutate({ carId, serviceLogId });
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
