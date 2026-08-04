import type { CarDto } from '@/car/application/dto/car';

export type CarDateColumn = keyof Pick<
  CarDto,
  'createdAt' | 'insuranceExpiration' | 'technicalInspectionExpiration'
>;

const baseKey = 'car';

export const queryKeys = {
  all: () => [baseKey] as const,
  infinite: (params?: { orderBy?: { column: CarDateColumn } }) =>
    params?.orderBy
      ? ([...queryKeys.all(), 'infinite', params.orderBy.column] as const)
      : ([...queryKeys.all(), 'infinite'] as const),
  byId: (id: string) => [...queryKeys.all(), id] as const,
} as const;
