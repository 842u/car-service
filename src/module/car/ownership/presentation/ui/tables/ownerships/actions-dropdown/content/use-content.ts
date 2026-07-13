import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { queryKeys as carQueryKeys } from '@/car/infrastructure/tanstack/query/keys';
import type { OwnershipDto } from '@/car/ownership/application/dto/ownership';
import { ownershipPromoteMutationOptions } from '@/car/ownership/infrastructure/tanstack/mutation-options/promote';
import { ownershipRemoveMutationOptions } from '@/car/ownership/infrastructure/tanstack/mutation-options/remove';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';
import { useDropdown } from '@/ui/dropdown/dropdown';

interface UseDropdownContentParams {
  ownership: OwnershipDto;
  username?: string | null;
  sessionUserId?: string;
}

export function useDropdownContent({
  ownership,
  username,
  sessionUserId,
}: UseDropdownContentParams) {
  const { close } = useDropdown();
  const { addToast } = useToasts();

  const deleteModalRef = useRef<DialogModalRef>(null);
  const promoteModalRef = useRef<DialogModalRef>(null);

  const router = useRouter();

  const queryClient = useQueryClient();

  // Removing or promoting an owner mutates the cache so this row's action
  // dropdown unmounts (the removed co-owner's row disappears; the acting user
  // is demoted) before the request settles. React Query drops callbacks passed
  // to mutate() once the caller unmounts, so the toasts live on the mutation
  // options (which still run) rather than on the mutate() call. onError is
  // composed so each options' optimistic rollback still runs.
  const removeMutationOptions = ownershipRemoveMutationOptions(queryClient);

  const { mutate: mutateDelete } = useMutation({
    ...removeMutationOptions,
    onSuccess: () => addToast(`Owner ${username} removed.`, 'success'),
    onError: (...args) => {
      removeMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  const promoteMutationOptions = ownershipPromoteMutationOptions(queryClient);

  const { mutate: mutatePromote } = useMutation({
    ...promoteMutationOptions,
    onSuccess: () => addToast(`Owner ${username} promoted.`, 'success'),
    onError: (...args) => {
      promoteMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  const carId = ownership.carId;

  const ownerId = ownership.ownerId;

  const selfDeletion = sessionUserId === ownerId;

  const handleDeleteButtonClick = () => {
    deleteModalRef.current?.showModal();
    close();
  };

  const handleDeleteModalCancel = () => deleteModalRef.current?.closeModal();

  const handleDeleteModalConfirm = () => {
    deleteModalRef.current?.closeModal();

    if (selfDeletion) {
      queryClient.invalidateQueries({ queryKey: carQueryKeys.carsInfinite });
      router.replace('/dashboard/cars' satisfies Route);
    }

    mutateDelete({ carId, ownerId });
  };

  const handlePromoteButtonClick = () => {
    promoteModalRef.current?.showModal();
    close();
  };

  const handlePromoteModalCancel = () => promoteModalRef.current?.closeModal();

  const handlePromoteModalConfirm = () => {
    promoteModalRef.current?.closeModal();

    mutatePromote({ carId, ownerId });
  };

  return {
    handleDeleteButtonClick,
    handleDeleteModalCancel,
    handleDeleteModalConfirm,
    handlePromoteButtonClick,
    handlePromoteModalCancel,
    handlePromoteModalConfirm,
    deleteModalRef,
    promoteModalRef,
    selfDeletion,
  };
}
