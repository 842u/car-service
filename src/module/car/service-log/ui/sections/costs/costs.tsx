import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { getServiceLogsWithCost } from '@/lib/supabase/tables/service_logs';
import { inputVariants } from '@/lib/tailwindcss/input';
import { queryKeys } from '@/lib/tanstack/keys';
import { parseDateToYyyyMmDd } from '@/lib/utils';

export function CostsSection() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const [fromDate, setFromDate] = useState<string>(
    parseDateToYyyyMmDd(firstDayOfMonth),
  );
  const [toDate, setToDate] = useState<string>(parseDateToYyyyMmDd(today));

  const { addToast } = useToasts();

  const { data, isError, error } = useQuery({
    queryKey: queryKeys.serviceLogsWithCost,
    queryFn: getServiceLogsWithCost,
    select: (serviceLogs) => {
      const totalCost = serviceLogs.reduce(
        (sum, log) => sum + (log.service_cost ?? 0),
        0,
      );

      const yearToDateCost = serviceLogs
        .filter(
          (log) =>
            new Date(log.service_date) >= oneYearAgo &&
            new Date(log.service_date) <= today,
        )
        .reduce((sum, log) => sum + (log.service_cost ?? 0), 0);

      const filteredCost = serviceLogs
        .filter(
          (log) =>
            new Date(log.service_date) >= new Date(fromDate!) &&
            new Date(log.service_date) <= new Date(toDate!),
        )
        .reduce((sum, log) => sum + (log.service_cost ?? 0), 0);

      return { totalCost, yearToDateCost, filteredCost };
    },
  });

  useEffect(() => {
    isError && addToast(error?.message || '', 'error');
  }, [isError, error, addToast]);

  return (
    <DashboardSection>
      <DashboardSection.Heading>Costs</DashboardSection.Heading>

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
    </DashboardSection>
  );
}
