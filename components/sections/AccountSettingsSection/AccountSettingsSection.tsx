import { AvatarForm } from '@/components/ui/AvatarForm/AvatarForm';
import { PasswordResetForm } from '@/components/ui/PasswordResetForm/PasswordResetForm';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';

import { UsernameForm } from '../../ui/UsernameForm/UsernameForm';

export function AccountSettingsSection() {
  return (
    <section
      aria-label="account settings"
      className="flex flex-col items-center justify-center gap-4 p-5"
    >
      <SettingsSection headingText="Username">
        <UsernameForm />
      </SettingsSection>
      <SettingsSection headingText="Avatar">
        <AvatarForm />
      </SettingsSection>
      <SettingsSection headingText="Reset password">
        <PasswordResetForm />
      </SettingsSection>
    </section>
  );
}
