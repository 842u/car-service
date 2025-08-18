'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { PasswordChangeSection } from '@/auth/presentation/ui/sections/password-change/password-change';
import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { DashboardMain } from '@/dashboard/ui/main/main';
import { AvatarSection } from '@/user/presentation/ui/sections/avatar/avatar';
import { IdSection } from '@/user/presentation/ui/sections/id/id';
import { UsernameSection } from '@/user/presentation/ui/sections/username/username';
import { getCurrentSessionProfile } from '@/utils/supabase/tables/profiles';
import { queryKeys } from '@/utils/tanstack/keys';

export default function AccountPage() {
  const { addToast } = useToasts();

  const { data, error, isError } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.profilesCurrentSession,
    queryFn: getCurrentSessionProfile,
  });

  useEffect(() => {
    isError && addToast(error.message, 'error');
  }, [isError, addToast, error]);

  return (
    <DashboardMain>
      <section
        aria-label="account settings"
        className="flex w-full flex-col items-center justify-center gap-5 p-5 lg:max-w-4xl"
      >
        <IdSection id={data?.id} />
        <UsernameSection username={data?.username} />
        <AvatarSection avatarUrl={data?.avatar_url} />
        <PasswordChangeSection />
      </section>
    </DashboardMain>
  );
}
