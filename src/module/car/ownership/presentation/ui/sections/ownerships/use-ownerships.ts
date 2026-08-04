import { useOwnerProfilesForCar } from '@/car/ownership/presentation/hook/use-owner-profiles-for-car';
import { useSessionUser } from '@/user/presentation/hook/use-session-user';

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
