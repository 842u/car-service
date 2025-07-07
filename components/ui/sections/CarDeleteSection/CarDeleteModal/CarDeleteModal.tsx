import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Route } from 'next';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/shared/base/Button/Button';
import {
  DialogModal,
  DialogModalProps,
} from '@/components/ui/shared/base/DialogModal/DialogModal';
import { useToasts } from '@/hooks/useToasts';
import { Car } from '@/types';
import { deleteCar } from '@/utils/supabase/tables/cars';
import {
  carsInfiniteDeleteOnError,
  carsInfiniteDeleteOnMutate,
} from '@/utils/tanstack/cars';
import { queryKeys } from '@/utils/tanstack/keys';

export const CAR_DELETE_MODAL_TEST_ID = 'CarDeleteModal_test_id';

type CarDeleteModalProps = Partial<DialogModalProps> & {
  carId: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export function CarDeleteModal({
  carId,
  onCancel,
  onConfirm,
  ...props
}: CarDeleteModalProps) {
  const router = useRouter();

  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const carQueryData = queryClient.getQueryData<Car>(
    queryKeys.carsByCarId(carId),
  );

  const carName = carQueryData?.custom_name;

  const { mutate } = useMutation({
    mutationKey: queryKeys.infiniteCars,
    throwOnError: false,
    mutationFn: ({ carId }: { carId: string; carName?: string }) =>
      deleteCar(carId),
    onMutate: ({ carId }) => carsInfiniteDeleteOnMutate(carId, queryClient),
    onSuccess: (_, { carName }) =>
      addToast(`Successfully deleted ${carName} car.`, 'success'),
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      carsInfiniteDeleteOnError(queryClient, context);
    },
  });

  const handleCancelButtonClick = () => {
    onCancel && onCancel();
  };

  const handleDeleteButtonClick = () => {
    onConfirm && onConfirm();

    mutate(
      { carId, carName },
      {
        onSettled: () =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.infiniteCars,
          }),
      },
    );

    router.replace('/dashboard/cars' satisfies Route);
  };

  return (
    <DialogModal
      {...props}
      data-testid={CAR_DELETE_MODAL_TEST_ID}
      headingText="Delete a car"
    >
      <p className="text-warning-500 dark:text-warning-300 my-4">
        Are you sure you want permanently delete this car?
      </p>
      <div className="flex w-full flex-col gap-4 md:flex-row md:justify-end md:px-4">
        <Button onClick={handleCancelButtonClick}>Cancel</Button>
        <Button variant="error" onClick={handleDeleteButtonClick}>
          Delete
        </Button>
      </div>
    </DialogModal>
  );
}
