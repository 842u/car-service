'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { AvatarSection } from '@/components/ui/sections/AvatarSection/AvatarSection';
import { IdSection } from '@/components/ui/sections/IdSection/IdSection';
import { PasswordChangeSection } from '@/components/ui/sections/PasswordChangeSection/PasswordChangeSection';
import { UsernameSection } from '@/components/ui/sections/UsernameSection/UsernameSection';
import { DashboardMain } from '@/components/ui/shared/DashboardMain/DashboardMain';
import { useToasts } from '@/features/common/hooks/useToasts';
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
