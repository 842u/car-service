import { useDeleteSection } from '@/car/ui/sections/delete/use-delete';
import { DashboardSection } from '@/dashboard/ui/section/section';

import { SectionControls } from './controls/controls';

interface DeleteSectionProps {
  carId: string;
  className?: string;
}

export function DeleteSection({ carId, className }: DeleteSectionProps) {
  const { isSessionUserPrimaryOwner } = useDeleteSection({ carId });

  return (
    <DashboardSection className={className} variant="errorDefault">
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
      <SectionControls canDelete={isSessionUserPrimaryOwner} carId={carId} />
    </DashboardSection>
  );
}
