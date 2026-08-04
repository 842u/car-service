import type { CarDto } from '@/car/application/dto/car';
import type { CarDateColumn } from '@/car/presentation/tanstack/query/keys';
import type { Result } from '@/common/application/result';

type CarDataSourceError = {
  message: string;
};

export interface CarDataSource {
  getById(id: string): Promise<Result<CarDto, CarDataSourceError>>;
  getByPage(params: {
    pageParam: number;
    pageLimit?: number;
    orderBy?: { column: CarDateColumn; ascending: boolean };
  }): Promise<
    Result<
      { data: (CarDto | null)[]; nextPageParam: number | null },
      CarDataSourceError
    >
  >;
}
