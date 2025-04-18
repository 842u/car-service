import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/schemas/zod/common';

import { PasswordChangeForm } from '../../forms/PasswordChangeForm/PasswordChangeForm';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';

export function PasswordChangeSection() {
  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Change Password
      </DashboardSection.Heading>
      <DashboardSection.Text>
        Update your current password to keep your account secure.
      </DashboardSection.Text>
      <DashboardSection.Subtext className="my-4">{`Length must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`}</DashboardSection.Subtext>
      <PasswordChangeForm />
    </DashboardSection>
  );
}
