import { useTechnicalInspectionExpirationSection } from '@/car/ui/sections/technical-inspection-expiration/use-technical-inspection';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { Spinner } from '@/ui/decorative/spinner/spinner';

export function TechnicalInspectionExpirationSection() {
  const { data, isPending } = useTechnicalInspectionExpirationSection();

  return (
    <DashboardSection>
      <DashboardSection.Heading>
        Technical inspection expiration
      </DashboardSection.Heading>
      {isPending ? (
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
      ) : (
        data?.pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.data.map((car) => (
              <div key={car.id}>
                <p>{car.id}</p>
                <p>{car.technical_inspection_expiration}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </DashboardSection>
  );
}
