import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';

import type { CarDto } from '@/car/application/dto/car';
import { carRemoveMutationOptions } from '@/car/presentation/tanstack/mutation-options/remove';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { useToasts } from '@/common/presentation/hook/use-toasts';

export type UseDeleteModalOptions = {
  carId: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export function useDeleteModal({
  carId,
  onCancel,
  onConfirm,
}: UseDeleteModalOptions) {
  const router = useRouter();

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

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

  const handleCancelButtonClick = () => {
    onCancel && onCancel();
  };

  const handleDeleteButtonClick = () => {
    onConfirm && onConfirm();

    mutate(carId);

    router.replace('/dashboard/cars' satisfies Route);
  };

  return {
    handlers: {
      handleCancelButtonClick,
      handleDeleteButtonClick,
    },
  };
}
