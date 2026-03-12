'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { TotalOwnershipsSection } from '@/car/ownership/ui/sections/total-ownerships/total-ownerships';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { DashboardMain } from '@/dashboard/ui/main/main';
import { getSessionUserQueryOptions } from '@/user/infrastructure/tanstack/query/options';

export default function DashboardPage() {
  const { addToast } = useToasts();

  const {
    data: userData,
    error: userError,
    isError: userIsError,
  } = useQuery(getSessionUserQueryOptions);

  useEffect(() => {
    userIsError && addToast(userError.message, 'error');
  }, [userIsError, addToast, userError]);

  return (
    <DashboardMain>
      <TotalOwnershipsSection ownerId={userData?.id || ''} />
    </DashboardMain>
  );
}
