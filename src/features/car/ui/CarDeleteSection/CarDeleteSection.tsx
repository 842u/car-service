import { Section } from '../../../dashboard/ui/section/section';
import {
  CarDeleteSectionControls,
  CarDeleteSectionControlsProps,
} from './CarDeleteSectionControls/CarDeleteSectionControls';

type CarDeleteSectionProps = CarDeleteSectionControlsProps;

export function CarDeleteSection({
  carId,
  isCurrentUserPrimaryOwner,
}: CarDeleteSectionProps) {
  return (
    <Section variant="errorDefault">
      <Section.Heading headingLevel="h2">Delete Car</Section.Heading>
      <Section.Text>
        Permanently delete this car for you and other owners.
      </Section.Text>
      <Section.Text className="text-warning-500">
        This action is irreversible and can not be undone.
      </Section.Text>
      <Section.Subtext className="my-4">
        If you do not want to see that car you can pass primary ownership to
        someone else and remove yourself from the owners list.
      </Section.Subtext>
      <CarDeleteSectionControls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </Section>
  );
}
