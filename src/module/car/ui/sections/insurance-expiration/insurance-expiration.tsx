import { useInsuranceExpirationSection } from '@/car/ui/sections/insurance-expiration/use-insurance-expiration';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { Spinner } from '@/ui/decorative/spinner/spinner';

export function InsuranceExpirationSection() {
  const { data, isPending } = useInsuranceExpirationSection();

  return (
    <DashboardSection>
      <DashboardSection.Heading>Insurance expiration</DashboardSection.Heading>
      {isPending ? (
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
      ) : (
        data?.pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.data.map((car) => (
              <div key={car.id}>
                <p>{car.id}</p>
                <p>{car.insurance_expiration}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </DashboardSection>
  );
}
