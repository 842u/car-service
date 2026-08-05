import { DashboardSection } from '@/dashboard/ui/section/section';
import {
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
} from '@/user/domain/user/value-object/name/name.schema';
import { NameForm } from '@/user/presentation/ui/forms/name/name';

const headingId = 'name-heading';

type NameSectionProps = {
  name?: string | null;
};

export function NameSection({ name }: NameSectionProps) {
  return (
    <DashboardSection aria-labelledby={headingId}>
      <DashboardSection.Heading headingLevel="h2" id={headingId}>
        Username
      </DashboardSection.Heading>
      <DashboardSection.Text>
        Please enter your full name, or a display name you are comfortable with.
      </DashboardSection.Text>
      <DashboardSection.Subtext className="my-4">{`Length between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`}</DashboardSection.Subtext>
      <NameForm name={name} />
    </DashboardSection>
  );
}
