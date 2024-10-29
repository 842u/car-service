import { AvatarUploader } from '@/components/ui/AvatarUploader/AvatarUploader';
import { SettingsSection } from '@/components/ui/SettingsSection/SettingsSection';

export function AvatarSection() {
  return (
    <SettingsSection headingText="Avatar">
      <AvatarUploader />
    </SettingsSection>
  );
}
