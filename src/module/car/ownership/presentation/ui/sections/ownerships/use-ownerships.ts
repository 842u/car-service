import { useOwnerProfilesForCar } from '@/car/ownership/presentation/hooks/use-owner-profiles-for-car';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

interface UseOwnershipsSectionParams {
  carId: string;
}

export function useOwnershipsSection({ carId }: UseOwnershipsSectionParams) {
  const { data: sessionUser } = useSessionUser();

  const { ownerships, users, isLoading } = useOwnerProfilesForCar(carId);

  const isSessionUserPrimaryOwner = !!ownerships?.find(
    (ownership) => ownership.ownerId === sessionUser?.id && ownership.isPrimary,
  );

  return {
    ownerships,
    users,
    isSessionUserPrimaryOwner,
    sessionUserId: sessionUser?.id,
    isLoading,
  };
}
