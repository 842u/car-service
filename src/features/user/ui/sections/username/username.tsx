import { Section } from '@/dashboard/ui/section/section';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/schemas/zod/common';
import { UsernameForm } from '@/user/ui/forms/username/username';

type UsernameSectionProps = {
  username?: string | null;
};

export function UsernameSection({ username }: UsernameSectionProps) {
  return (
    <Section>
      <Section.Heading headingLevel="h2">Username</Section.Heading>
      <Section.Text>
        Please enter your full name, or a display name you are comfortable with.
      </Section.Text>
      <Section.Subtext className="my-4">{`Letters, numbers and single whitespaces allowed. Length between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`}</Section.Subtext>
      <UsernameForm username={username} />
    </Section>
  );
}
