import { useInfiniteQuery } from '@tanstack/react-query';

import { DashboardSection } from '@/dashboard/ui/section/section';
import { getCarsByPage } from '@/lib/supabase/tables/cars';
import { queryKeys } from '@/lib/tanstack/keys';

export function TechnicalInspectionExpirationSection() {
  const { data } = useInfiniteQuery({
    throwOnError: false,
    queryKey: queryKeys.carsInfiniteByColumnOrder(
      'technical_inspection_expiration',
    ),
    queryFn: async ({ pageParam }) => {
      const { data, nextPageParam } = await getCarsByPage({
        pageParam,
        pageLimit: 3,
        orderBy: { column: 'technical_inspection_expiration', ascending: true },
      });

      return { data, nextPageParam };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  return (
    <DashboardSection>
      <DashboardSection.Heading>
        Technical inspection expiration
      </DashboardSection.Heading>
      {data?.pages.map((page) => (
        <div key={crypto.randomUUID()}>
          {page.data.map((car) => (
            <div key={crypto.randomUUID()}>
              <p>{car.id}</p>
              <p>{car.technical_inspection_expiration}</p>
            </div>
          ))}
        </div>
      ))}
    </DashboardSection>
  );
}
