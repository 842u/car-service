import { QueryClient } from '@tanstack/react-query';

import { buildCarDto } from '@/car/application/dto/car.builder';
import { carDataSource } from '@/car/dependency/data-source';
import { queryKeys } from '@/car/presentation/tanstack/query/keys';
import { getCarsInfiniteQueryOptions } from '@/car/presentation/tanstack/query/options';

const mockCarDataSource = carDataSource as jest.Mocked<typeof carDataSource>;
jest.mock('@/car/dependency/data-source');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getCarsInfiniteQueryOptions', () => {
  it('seeds the byId cache for every car in the fetched page', async () => {
    const CAR_1 = buildCarDto({ id: 'car-1' });
    const CAR_2 = buildCarDto({ id: 'car-2' });
    mockCarDataSource.getByPage.mockResolvedValue({
      success: true,
      data: { data: [CAR_1, CAR_2], nextPageParam: null },
    });
    const queryClient = new QueryClient();

    await queryClient.fetchInfiniteQuery(getCarsInfiniteQueryOptions());

    expect(queryClient.getQueryData(queryKeys.byId(CAR_1.id))).toEqual(CAR_1);
    expect(queryClient.getQueryData(queryKeys.byId(CAR_2.id))).toEqual(CAR_2);
  });
});
