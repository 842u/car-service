'use client';

import { PasswordResetForm } from '@/components/ui/PasswordResetForm/PasswordResetForm';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';

import { UsernameForm } from '../../ui/UsernameForm/UsernameForm';
import { AvatarSection } from '../AvatarSection/AvatarSection';

export function AccountSettingsSection() {
  return (
    <section
      aria-label="account settings"
      className="flex flex-col items-center justify-center gap-4"
    >
      <SettingsSection headingText="Username">
        <UsernameForm />
      </SettingsSection>
      <AvatarSection />
      <SettingsSection headingText="Reset password">
        <PasswordResetForm />
      </SettingsSection>
    </section>
  );
}
