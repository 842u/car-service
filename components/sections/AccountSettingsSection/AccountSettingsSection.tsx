'use client';

import { useContext } from 'react';

import { Avatar } from '@/components/ui/Avatar/Avatar';
import { PasswordResetForm } from '@/components/ui/PasswordResetForm/PasswordResetForm';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';
import { UserProfileContext } from '@/context/UserProfileContext';

export function AccountSettingsSection() {
  const userProfile = useContext(UserProfileContext);

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <SettingsSection headingText="Avatar">
        <div className="relative h-24 w-24">
          <label
            aria-label="upload avatar"
            className="absolute z-10 inline-block h-full w-full cursor-pointer rounded-full"
            htmlFor="avatar-upload"
          >
            <input className="hidden" id="avatar-upload" type="file" />
          </label>
          <Avatar src={userProfile?.avatar_url || ''} />
        </div>
      </SettingsSection>
      <SettingsSection headingText="Reset password">
        <div>
          <PasswordResetForm />
        </div>
      </SettingsSection>
    </section>
  );
}
