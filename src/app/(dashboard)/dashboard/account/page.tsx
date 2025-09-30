'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { DashboardMain } from '@/dashboard/ui/main/main';
import { dependencyContainer, dependencyTokens } from '@/di';
import { AvatarSection } from '@/user/presentation/ui/sections/avatar/avatar';
import { IdSection } from '@/user/presentation/ui/sections/id/id';
import { NameSection } from '@/user/presentation/ui/sections/name/name';
import { PasswordChangeSection } from '@/user/presentation/ui/sections/password-change/password-change';
import { queryKeys } from '@/utils/tanstack/keys';

export default function AccountPage() {
  const { addToast } = useToasts();

  const { data, error, isError } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.profilesCurrentSession,
    queryFn: async () => {
      const userStore = await dependencyContainer.resolve(
        dependencyTokens.USER_STORE,
      );

      const userResult = await userStore.getSessionUser();

      if (!userResult.success) {
        const { message } = userResult.error;
        throw new Error(message);
      }

      return userResult.data;
    },
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
        <NameSection name={data?.name} />
        <AvatarSection avatarUrl={data?.avatarUrl} />
        <PasswordChangeSection />
      </section>
    </DashboardMain>
  );
}
