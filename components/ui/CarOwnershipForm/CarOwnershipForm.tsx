import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { ChangeKeyIcon } from '@/components/decorative/icons/ChangeKeyIcon';
import { UserMinusIcon } from '@/components/decorative/icons/UserMinusIcon';
import { UserPlusIcon } from '@/components/decorative/icons/UserPlusIcon';
import { useToasts } from '@/hooks/useToasts';
import {
  deleteCarOwnershipsByOwnersIds,
  getCarOwnershipsByCarId,
  getCurrentSessionProfile,
  getProfileById,
} from '@/utils/supabase/general';
import { onMutateCarOwnershipDelete } from '@/utils/tanstack/general';

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
  const confirmOwnershipRemovalModalRef = useRef<DialogModalRef>(null);

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

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (carOwnershipFormData: CarOwnershipFormValues) =>
      deleteCarOwnershipsByOwnersIds(carId, carOwnershipFormData.ownersIds),
    onMutate: (carOwnershipFormData: CarOwnershipFormValues) =>
      onMutateCarOwnershipDelete(carOwnershipFormData, queryClient, carId),
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

  const isCurrentUserPrimaryOwner = !!carOwnershipData?.find(
    (ownership) =>
      ownership.owner_id === sessionProfileData?.id &&
      ownership.is_primary_owner,
  );

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
      <form id="carOwnershipForm" onSubmit={handleSubmit(handleFormSubmit)}>
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
            disabled={!isCurrentUserPrimaryOwner}
            title="Grant primary ownership"
          >
            <ChangeKeyIcon className="stroke-light-500 mx-2 h-full w-full stroke-7" />
            <span className="sr-only">Grant primary ownership</span>
          </Button>
          <Button
            className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 cursor-pointer p-1.5"
            disabled={!isDirty && !isSubmitting}
            title="Remove selected owners"
            onClick={() => confirmOwnershipRemovalModalRef.current?.showModal()}
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
      <DialogModal ref={confirmOwnershipRemovalModalRef}>
        <div className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 max-w-md rounded-xl border-2 p-10">
          <h2>Remove ownership</h2>
          <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
          <p>Are you sure you want to remove ownership from selected users?</p>
          <div className="mt-5 flex justify-evenly">
            <Button
              disabled={!isDirty && !isSubmitting}
              onClick={() => {
                reset();
                confirmOwnershipRemovalModalRef.current?.closeModal();
              }}
            >
              Reset
            </Button>
            <Button
              className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800"
              disabled={!isDirty && !isSubmitting}
              form="carOwnershipForm"
              type="submit"
              onClick={() =>
                confirmOwnershipRemovalModalRef.current?.closeModal()
              }
            >
              Save
            </Button>
          </div>
        </div>
      </DialogModal>
      <DialogModal ref={newCarOwnerModalRef}>
        <NewCarOwnerForm
          carId={carId}
          onSubmit={() => newCarOwnerModalRef.current?.closeModal()}
        />
      </DialogModal>
    </>
  );
}
