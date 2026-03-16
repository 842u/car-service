import { useCostsSection } from '@/car/service-log/ui/sections/costs/use-costs';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { inputVariants } from '@/lib/tailwindcss/input';
import { Spinner } from '@/ui/decorative/spinner/spinner';

export function CostsSection() {
  const { data, isPending, fromDate, setFromDate, toDate, setToDate } =
    useCostsSection();

  return (
    <DashboardSection>
      <DashboardSection.Heading>Costs</DashboardSection.Heading>
      {isPending && (
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
      )}

      {!isPending && (
        <>
          <div>
            <DashboardSection.Subtext>Total:</DashboardSection.Subtext>
            <DashboardSection.Text className="text-5xl">
              {data?.totalCost ?? 0}
            </DashboardSection.Text>
          </div>

          <div className="my-3">
            <DashboardSection.Subtext>Year to date:</DashboardSection.Subtext>
            <DashboardSection.Text className="text-4xl">
              {data?.yearToDateCost ?? 0}
            </DashboardSection.Text>
          </div>

          <div className="my-4 flex flex-col gap-2 md:w-fit md:flex-row md:flex-wrap">
            <label className="md:grow">
              <p className="my-2 text-xs">From</p>
              <input
                className={inputVariants.default}
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
              />
            </label>

            <label className="md:grow">
              <p className="my-2 text-xs">To</p>
              <input
                className={inputVariants.default}
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
              />
            </label>
          </div>

          <DashboardSection.Subtext>Filtered</DashboardSection.Subtext>
          <DashboardSection.Text className="text-4xl">
            {data?.filteredCost ?? 0}
          </DashboardSection.Text>
        </>
      )}
    </DashboardSection>
  );
}
