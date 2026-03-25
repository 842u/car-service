'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { DashboardMain } from '@/dashboard/ui/main/main';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { getSessionUserQueryOptions } from '@/user/infrastructure/tanstack/query/options';
import { AvatarSection } from '@/user/presentation/ui/sections/avatar/avatar';
import { IdSection } from '@/user/presentation/ui/sections/id/id';
import { NameSection } from '@/user/presentation/ui/sections/name/name';
import { PasswordChangeSection } from '@/user/presentation/ui/sections/password-change/password-change';

export default function AccountPage() {
  const { addToast } = useToasts();

  const { data, error, isError } = useQuery(getSessionUserQueryOptions);

  useEffect(() => {
    isError && addToast(error.message, 'error');
  }, [isError, addToast, error]);

  return (
    <DashboardMain>
      <DashboardSection variant="raw">
        <DashboardSection.Heading>Account settings</DashboardSection.Heading>
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          <IdSection id={data?.id} />
          <NameSection name={data?.name} />
          <AvatarSection avatarUrl={data?.avatarUrl} />
          <PasswordChangeSection />
        </div>
      </DashboardSection>
    </DashboardMain>
  );
}
