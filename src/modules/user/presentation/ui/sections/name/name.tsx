import { DashboardSection } from '@/dashboard/ui/section/section';
import {
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
} from '@/user/domain/user/value-objects/name/name.schema';
import { NameForm } from '@/user/presentation/ui/forms/name/name';

type NameSectionProps = {
  name?: string | null;
};

export function NameSection({ name }: NameSectionProps) {
  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Username
      </DashboardSection.Heading>
      <DashboardSection.Text>
        Please enter your full name, or a display name you are comfortable with.
      </DashboardSection.Text>
      <DashboardSection.Subtext className="my-4">{`Letters, numbers and single whitespaces allowed. Length between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters.`}</DashboardSection.Subtext>
      <NameForm name={name} />
    </DashboardSection>
  );
}
