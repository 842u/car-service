'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { AvatarForm } from '@/components/ui/AvatarForm/AvatarForm';
import { IdSection } from '@/components/ui/IdSection/IdSection';
import { PasswordResetForm } from '@/components/ui/PasswordResetForm/PasswordResetForm';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';
import { useToasts } from '@/hooks/useToasts';
import { getProfile } from '@/utils/supabase/general';

import { UsernameForm } from '../../ui/UsernameForm/UsernameForm';

export function AccountSettingsSection() {
  const { addToast } = useToasts();

  const { data, error, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  useEffect(() => {
    isError && addToast(error.message, 'error');
  }, [isError, addToast, error]);

  return (
    <section
      aria-label="account settings"
      className="flex flex-col items-center justify-center gap-4 p-5"
    >
      <IdSection id={data?.id} />
      <SettingsSection headingText="Username">
        <UsernameForm data={data} />
      </SettingsSection>
      <SettingsSection headingText="Avatar">
        <AvatarForm data={data} />
      </SettingsSection>
      <SettingsSection headingText="Reset password">
        <PasswordResetForm />
      </SettingsSection>
    </section>
  );
}
