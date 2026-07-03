'use client';

import { DashboardMain } from '@/dashboard/ui/main/main';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { useSessionUser } from '@/user/presentation/hooks/use-session-user';
import { AvatarSection } from '@/user/presentation/ui/sections/avatar/avatar';
import { IdSection } from '@/user/presentation/ui/sections/id/id';
import { NameSection } from '@/user/presentation/ui/sections/name/name';
import { PasswordChangeSection } from '@/user/presentation/ui/sections/password-change/password-change';

export default function AccountPage() {
  const { data } = useSessionUser();

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
