import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import {
  getCarOwnershipsByCarId,
  getCurrentSessionProfile,
  getProfileById,
} from '@/utils/supabase/general';

import { CarOwnershipControls } from '../CarOwnershipControls/CarOwnershipControls';
import { CarOwnershipTable } from '../CarOwnershipTable/CarOwnershipTable';
import { RemoveCarOwnershipFormValues } from '../RemoveCarOwnershipForm/RemoveCarOwnershipForm';

type CarOwnershipSectionProps = {
  carId: string;
};

const defaultCarOwnershipFormValues: RemoveCarOwnershipFormValues = {
  ownersIds: [],
};

export function CarOwnershipSection({ carId }: CarOwnershipSectionProps) {
  const { addToast } = useToasts();

  const { data: carOwnershipData, error: carOwnershipDataError } = useQuery({
    queryKey: ['ownership', carId],
    queryFn: () => getCarOwnershipsByCarId(carId),
  });

  const { data: sessionProfileData, error: sessionProfileDataError } = useQuery(
    {
      queryKey: ['profile', 'session'],
      queryFn: getCurrentSessionProfile,
    },
  );

  const removeCarOwnershipFormMethods = useForm({
    mode: 'onChange',
    defaultValues: defaultCarOwnershipFormValues,
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

  useEffect(() => {
    carOwnershipDataError && addToast(carOwnershipDataError.message, 'error');
    sessionProfileDataError &&
      addToast(sessionProfileDataError.message, 'error');
  }, [addToast, carOwnershipDataError, sessionProfileDataError]);

  return (
    <section className="my-5 overflow-x-auto">
      <h2>Car Ownership</h2>
      <CarOwnershipTable
        carOwnershipData={carOwnershipData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfilesData={ownersProfiles}
        register={removeCarOwnershipFormMethods.register}
        sessionProfileData={sessionProfileData}
      />
      <CarOwnershipControls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        removeCarOwnershipFormMethods={removeCarOwnershipFormMethods}
      />
    </section>
  );
}
