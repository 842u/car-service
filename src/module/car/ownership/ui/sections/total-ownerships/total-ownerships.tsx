import { useTotalOwnershipsSection } from '@/car/ownership/ui/sections/total-ownerships/use-total-ownerships';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { Spinner } from '@/ui/decorative/spinner/spinner';

interface TotalOwnershipsSectionProps {
  ownerId: string;
  className?: string;
}

export function TotalOwnershipsSection({
  ownerId,
  className,
}: TotalOwnershipsSectionProps) {
  const { data, isPending } = useTotalOwnershipsSection({ ownerId });

  return (
    <DashboardSection className={className}>
      <DashboardSection.Heading headingLevel="h2">
        Cars owned
      </DashboardSection.Heading>
      <DashboardSection.Text className="text-center text-9xl">
        {isPending ? (
          <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
        ) : (
          data?.length
        )}
      </DashboardSection.Text>
    </DashboardSection>
  );
}
