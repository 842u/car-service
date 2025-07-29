import { PasswordChangeForm } from '@/features/auth/ui/PasswordChangeForm/PasswordChangeForm';
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/schemas/zod/common';

import { Section } from '../../../dashboard/ui/section/section';

export function PasswordChangeSection() {
  return (
    <Section>
      <Section.Heading headingLevel="h2">Change Password</Section.Heading>
      <Section.Text>
        Update your current password to keep your account secure.
      </Section.Text>
      <Section.Subtext className="my-4">{`Length must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`}</Section.Subtext>
      <PasswordChangeForm />
    </Section>
  );
}
