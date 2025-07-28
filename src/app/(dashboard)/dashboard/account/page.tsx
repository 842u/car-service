'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { PasswordChangeSection } from '@/features/auth/ui/PasswordChangeSection/PasswordChangeSection';
import { useToasts } from '@/features/common/hooks/use-toasts';
import { DashboardMain } from '@/features/dashboard/ui/DashboardMain/DashboardMain';
import { AvatarSection } from '@/features/user/ui/AvatarSection/AvatarSection';
import { IdSection } from '@/features/user/ui/IdSection/IdSection';
import { UsernameSection } from '@/features/user/ui/UsernameSection/UsernameSection';
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
