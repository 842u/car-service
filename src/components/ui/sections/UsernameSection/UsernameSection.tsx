import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/schemas/zod/common';

import { UsernameForm } from '../../forms/UsernameForm/UsernameForm';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';

type UsernameSectionProps = {
  username?: string | null;
};

export function UsernameSection({ username }: UsernameSectionProps) {
  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Username
      </DashboardSection.Heading>
      <DashboardSection.Text>
        Please enter your full name, or a display name you are comfortable with.
      </DashboardSection.Text>
      <DashboardSection.Subtext className="my-4">{`Letters, numbers and single whitespaces allowed. Length between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`}</DashboardSection.Subtext>
      <UsernameForm username={username} />
    </DashboardSection>
  );
}
