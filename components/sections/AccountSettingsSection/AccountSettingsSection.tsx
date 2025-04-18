'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { IdSection } from '@/components/ui/IdSection/IdSection';
import { PasswordChangeSection } from '@/components/ui/PasswordChangeSection/PasswordChangeSection';
import { AvatarSection } from '@/components/ui/sections/AvatarSection/AvatarSection';
import { UsernameSection } from '@/components/ui/UsernameSection/UsernameSection';
import { useToasts } from '@/hooks/useToasts';
import { getCurrentSessionProfile } from '@/utils/supabase/tables/profiles';
import { queryKeys } from '@/utils/tanstack/keys';

export function AccountSettingsSection() {
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
    <section
      aria-label="account settings"
      className="flex w-full flex-col items-center justify-center gap-5 p-5 lg:max-w-4xl"
    >
      <IdSection id={data?.id} />
      <UsernameSection username={data?.username} />
      <AvatarSection avatarUrl={data?.avatar_url} />
      <PasswordChangeSection />
    </section>
  );
}
