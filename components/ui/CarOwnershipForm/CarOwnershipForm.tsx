import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { UserMinusIcon } from '@/components/decorative/icons/UserMinusIcon';
import { UserPlusIcon } from '@/components/decorative/icons/UserPlusIcon';
import { useToasts } from '@/hooks/useToasts';
import {
  deleteCarOwnershipsByOwnersIds,
  getCarOwnershipsByCarId,
  getCurrentSessionProfile,
  getProfileById,
} from '@/utils/supabase/general';
import { onMutateCarOwnershipMutation } from '@/utils/tanstack/general';

import { Button } from '../Button/Button';
import { CarOwnershipTable } from '../CarOwnershipTable/CarOwnershipTable';
import { DialogModal, DialogModalRef } from '../DialogModal/DialogModal';
import { NewCarOwnerForm } from '../NewCarOwnerForm/NewCarOwnerForm';

export type CarOwnershipFormValues = {
  ownersIds: string[];
};

const defaultCarOwnershipFormValues: CarOwnershipFormValues = {
  ownersIds: [],
};

type CarOwnershipFormProps = {
  carId: string;
};

export function CarOwnershipForm({ carId }: CarOwnershipFormProps) {
  const newCarOwnerModalRef = useRef<DialogModalRef>(null);

  const { addToast } = useToasts();

  const { data: carOwnershipData, error: carOwnershipError } = useQuery({
    queryKey: ['ownership', carId],
    queryFn: () => getCarOwnershipsByCarId(carId),
  });

  const { data: sessionProfileData, error: sessionProfileError } = useQuery({
    queryKey: ['profile', 'session'],
    queryFn: getCurrentSessionProfile,
  });

  const allowDependentQueries =
    sessionProfileData && carOwnershipData && carOwnershipData.length;

  const ownersProfiles = useQueries({
    queries: allowDependentQueries
      ? carOwnershipData
          .filter((ownership) => ownership.owner_id !== sessionProfileData.id)
          .map((ownership) => {
            return {
              queryKey: ['profile', ownership.owner_id],
              queryFn: () => getProfileById(ownership.owner_id),
            };
          })
      : [],
  });

  const isCurrentUserPrimaryOwner = !!carOwnershipData?.find(
    (ownership) =>
      ownership.owner_id === sessionProfileData?.id &&
      ownership.is_primary_owner,
  );

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (carOwnershipFormData: CarOwnershipFormValues) =>
      deleteCarOwnershipsByOwnersIds(carId, carOwnershipFormData.ownersIds),
    onMutate: (carOwnershipFormData: CarOwnershipFormValues) =>
      onMutateCarOwnershipMutation(carOwnershipFormData, queryClient, carId),
    onSuccess: () => {
      addToast('Successfully removed ownerships.', 'success');
    },
    onError: (error, _, context) => {
      addToast(error.message, 'error');
      queryClient.setQueryData(
        ['ownership', carId],
        context?.previousQueryData,
      );
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['ownership', carId] }),
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting, isSubmitSuccessful },
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultCarOwnershipFormValues,
  });

  const handleFormSubmit = async (data: CarOwnershipFormValues) => {
    await mutateAsync(data);
  };

  useEffect(() => {
    carOwnershipError && addToast(carOwnershipError.message, 'error');
    sessionProfileError && addToast(sessionProfileError.message, 'error');
  }, [addToast, carOwnershipError, sessionProfileError]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CarOwnershipTable
          carOwnershipData={carOwnershipData}
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
          ownersProfilesData={ownersProfiles}
          register={register}
          sessionProfileData={sessionProfileData}
        />
        <div className="m-5 flex justify-end gap-5">
          <Button
            className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 cursor-pointer p-1.5"
            disabled={!isDirty || !isSubmitting}
            title="Remove selected owners"
            type="submit"
          >
            <UserMinusIcon className="stroke-light-500 mx-2 h-full w-full" />
            <span className="sr-only">Remove selected owners</span>
          </Button>
          <Button
            className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 cursor-pointer p-1.5"
            disabled={!isCurrentUserPrimaryOwner}
            title="Add owner"
            onClick={() => newCarOwnerModalRef.current?.showModal()}
          >
            <UserPlusIcon className="stroke-light-500 mx-2 h-full w-full" />
            <span className="sr-only">Add owner</span>
          </Button>
        </div>
      </form>
      <DialogModal ref={newCarOwnerModalRef}>
        <NewCarOwnerForm carId={carId} />
      </DialogModal>
    </>
  );
}
