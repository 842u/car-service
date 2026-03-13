'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { TotalOwnershipsSection } from '@/car/ownership/ui/sections/total-ownerships/total-ownerships';
import { CostsSection } from '@/car/service-log/ui/sections/costs/costs';
import { InsuranceExpirationSection } from '@/car/ui/sections/insurance-expiration/insurance-expiration';
import { TechnicalInspectionExpirationSection } from '@/car/ui/sections/technical-inspection-expiration/technical-inspection-expiration';
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
      <div>
        <TotalOwnershipsSection ownerId={userData?.id || ''} />
        <InsuranceExpirationSection />
        <TechnicalInspectionExpirationSection />
        <CostsSection />
      </div>
    </DashboardMain>
  );
}
