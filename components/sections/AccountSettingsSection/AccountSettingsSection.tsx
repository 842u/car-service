'use client';

import { PasswordResetForm } from '@/components/ui/PasswordResetForm/PasswordResetForm';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';

import { AvatarSection } from '../AvatarSection/AvatarSection';
import { UsernameSection } from '../UsernameSection/UsernameSection';

export function AccountSettingsSection() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <UsernameSection />
      <AvatarSection />
      <SettingsSection headingText="Reset password">
        <PasswordResetForm />
      </SettingsSection>
    </section>
  );
}
