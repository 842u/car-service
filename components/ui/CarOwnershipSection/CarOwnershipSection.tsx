import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { ChangeKeyIcon } from '@/components/decorative/icons/ChangeKeyIcon';
import { UserMinusIcon } from '@/components/decorative/icons/UserMinusIcon';
import { UserPlusIcon } from '@/components/decorative/icons/UserPlusIcon';
import { useToasts } from '@/hooks/useToasts';
import {
  getCarOwnershipsByCarId,
  getCurrentSessionProfile,
  getProfileById,
} from '@/utils/supabase/general';

import { Button } from '../Button/Button';
import { CarOwnershipTable } from '../CarOwnershipTable/CarOwnershipTable';
import { DialogModal, DialogModalRef } from '../DialogModal/DialogModal';
import { GrantCarPrimaryOwnershipForm } from '../GrantPrimaryOwnershipForm/GrantPrimaryOwnershipForm';
import { NewCarOwnerForm } from '../NewCarOwnerForm/NewCarOwnerForm';
import {
  RemoveCarOwnershipForm,
  RemoveCarOwnershipFormValues,
} from '../RemoveCarOwnershipForm/RemoveCarOwnershipForm';

type CarOwnershipSectionProps = {
  carId: string;
};

const defaultCarOwnershipFormValues: RemoveCarOwnershipFormValues = {
  ownersIds: [],
};

export function CarOwnershipSection({ carId }: CarOwnershipSectionProps) {
  const newCarOwnerModalRef = useRef<DialogModalRef>(null);
  const removeCarOwnershipFormModalRef = useRef<DialogModalRef>(null);
  const grantPrimaryOwnershipModalRef = useRef<DialogModalRef>(null);

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

  const removeCarOwnershipForm = useForm({
    mode: 'onChange',
    defaultValues: defaultCarOwnershipFormValues,
  });

  const isCurrentUserPrimaryOwner = !!carOwnershipData?.find(
    (ownership) =>
      ownership.owner_id === sessionProfileData?.id &&
      ownership.is_primary_owner,
  );

  useEffect(() => {
    carOwnershipError && addToast(carOwnershipError.message, 'error');
    sessionProfileError && addToast(sessionProfileError.message, 'error');
  }, [addToast, carOwnershipError, sessionProfileError]);

  return (
    <section className="my-5 overflow-x-auto">
      <h2>Car Ownership</h2>
      <CarOwnershipTable
        carOwnershipData={carOwnershipData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfilesData={ownersProfiles}
        register={removeCarOwnershipForm.register}
        sessionProfileData={sessionProfileData}
      />
      <div className="m-5 flex justify-end gap-5">
        <Button
          className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 cursor-pointer p-1.5"
          disabled={!isCurrentUserPrimaryOwner}
          title="Grant primary ownership"
          onClick={() => grantPrimaryOwnershipModalRef.current?.showModal()}
        >
          <ChangeKeyIcon className="stroke-light-500 mx-2 h-full w-full stroke-7" />
          <span className="sr-only">Grant primary ownership</span>
        </Button>
        <Button
          className="border-accent-500 bg-accent-800 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 cursor-pointer p-1.5"
          disabled={
            !removeCarOwnershipForm.formState.isDirty &&
            !removeCarOwnershipForm.formState.isSubmitting
          }
          title="Remove selected owners"
          onClick={() => removeCarOwnershipFormModalRef.current?.showModal()}
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
      <DialogModal ref={grantPrimaryOwnershipModalRef}>
        <GrantCarPrimaryOwnershipForm
          carId={carId}
          onSubmit={() => grantPrimaryOwnershipModalRef.current?.closeModal()}
        />
      </DialogModal>
      <DialogModal ref={removeCarOwnershipFormModalRef}>
        <FormProvider<RemoveCarOwnershipFormValues> {...removeCarOwnershipForm}>
          <RemoveCarOwnershipForm
            carId={carId}
            onReset={() => removeCarOwnershipFormModalRef.current?.closeModal()}
            onSubmit={() =>
              removeCarOwnershipFormModalRef.current?.closeModal()
            }
          />
        </FormProvider>
      </DialogModal>
      <DialogModal ref={newCarOwnerModalRef}>
        <NewCarOwnerForm
          carId={carId}
          onSubmit={() => newCarOwnerModalRef.current?.closeModal()}
        />
      </DialogModal>
    </section>
  );
}
