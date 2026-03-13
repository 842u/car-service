import { useInfiniteQuery } from '@tanstack/react-query';

import { DashboardSection } from '@/dashboard/ui/section/section';
import { getCarsByPage } from '@/lib/supabase/tables/cars';
import { queryKeys } from '@/lib/tanstack/keys';

export function InsuranceExpirationSection() {
  const { data } = useInfiniteQuery({
    throwOnError: false,
    queryKey: queryKeys.carsInfiniteByColumnOrder('insurance_expiration'),
    queryFn: async ({ pageParam }) => {
      const { data, nextPageParam } = await getCarsByPage({
        pageParam,
        pageLimit: 3,
        orderBy: { column: 'insurance_expiration', ascending: true },
      });

      return { data, nextPageParam };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  return (
    <DashboardSection>
      <DashboardSection.Heading>Insurance expiration</DashboardSection.Heading>
      {data?.pages.map((page) => (
        <div key={crypto.randomUUID()}>
          {page.data.map((car) => (
            <div key={crypto.randomUUID()}>
              <p>{car.id}</p>
              <p>{car.insurance_expiration}</p>
            </div>
          ))}
        </div>
      ))}
    </DashboardSection>
  );
}
