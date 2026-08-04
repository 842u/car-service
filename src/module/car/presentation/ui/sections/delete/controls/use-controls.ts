import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import type { CarDto } from '@/car/application/dto/car';
import { carRemoveMutationOptions } from '@/car/presentation/tanstack/mutation-options/remove';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import type { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

type UseSectionControlsParams = {
  carId: string;
};

export function useSectionControls({ carId }: UseSectionControlsParams) {
  const router = useRouter();

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const dialogRef = useRef<DialogModalRef>(null);

  const carQueryData = queryClient.getQueryData<CarDto>(queryKeys.byId(carId));

  const carName = carQueryData?.customName;

  const { mutate } = useMutation({
    ...carRemoveMutationOptions,
    onSuccess: () => addToast(`Car ${carName} deleted.`, 'success'),
    onError: (...args) => {
      carRemoveMutationOptions.onError?.(...args);
      addToast(args[0].message, 'error');
    },
  });

  const handleDeleteButtonClick = () => dialogRef.current?.showModal();

  const handleDeleteModalCancel = () => dialogRef.current?.closeModal();

  const handleDeleteModalConfirm = () => {
    dialogRef.current?.closeModal();

    mutate(carId);

    router.replace('/dashboard/cars' satisfies Route);
  };

  return {
    dialogRef,
    handleDeleteButtonClick,
    handleDeleteModalCancel,
    handleDeleteModalConfirm,
  };
}
