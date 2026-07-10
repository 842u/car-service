'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getCarByIdQueryOptions } from '@/car/infrastructure/tanstack/query/options';
import { getOwnershipsByCarIdQueryOptions } from '@/car/ownership/infrastructure/tanstack/query/options';
import { DetailsCard } from '@/car/presentation/ui/cards/details/details';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';

import { SectionControls } from './controls/controls';

interface DetailsSectionProps {
  carId: string;
  className?: string;
}

export function DetailsSection({ carId, className }: DetailsSectionProps) {
  const { data: sessionUser } = useSessionUser();

  const { addToast } = useToasts();

  const {
    data: carData,
    error: carError,
    isLoading: isCarDataLoading,
  } = useQuery(getCarByIdQueryOptions(carId));

  const { data: ownerships, error: ownershipsError } = useQuery(
    getOwnershipsByCarIdQueryOptions(carId),
  );

  useEffect(() => {
    carError && addToast(carError.message, 'error');
  }, [addToast, carError]);

  useEffect(() => {
    ownershipsError && addToast(ownershipsError.message, 'error');
  }, [addToast, ownershipsError]);

  const isSessionUserPrimaryOwner = !!ownerships?.find(
    (ownership) => ownership.ownerId === sessionUser?.id && ownership.isPrimary,
  );

  if (isCarDataLoading) {
    return (
      <DashboardSection aria-label="Vehicle details" className={className}>
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
      </DashboardSection>
    );
  }

  return (
    <DashboardSection aria-label="Vehicle details" className={className}>
      <DetailsCard car={carData} className="mb-5" />
      <SectionControls canEdit={isSessionUserPrimaryOwner} car={carData} />
    </DashboardSection>
  );
}
