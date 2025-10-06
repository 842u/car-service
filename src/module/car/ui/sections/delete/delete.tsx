import { DashboardSection } from '@/dashboard/ui/section/section';

import type { SectionControlsProps } from './controls/controls';
import { SectionControls } from './controls/controls';

type DeleteSectionProps = SectionControlsProps;

export function DeleteSection({
  carId,
  isCurrentUserPrimaryOwner,
}: DeleteSectionProps) {
  return (
    <DashboardSection variant="errorDefault">
      <DashboardSection.Heading headingLevel="h2">
        Delete Car
      </DashboardSection.Heading>
      <DashboardSection.Text>
        Permanently delete this car for you and other owners.
      </DashboardSection.Text>
      <DashboardSection.Text className="text-warning-500">
        This action is irreversible and can not be undone.
      </DashboardSection.Text>
      <DashboardSection.Subtext className="my-4">
        If you do not want to see that car you can pass primary ownership to
        someone else and remove yourself from the owners list.
      </DashboardSection.Subtext>
      <SectionControls
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </DashboardSection>
  );
}
