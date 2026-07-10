import type { CarDto } from '@/car/application/dto/car';
import type { Result } from '@/common/application/result';

type CarDataSourceError = {
  message: string;
};

type CarOrderColumn = keyof Pick<
  CarDto,
  'createdAt' | 'insuranceExpiration' | 'technicalInspectionExpiration'
>;

export interface CarDataSource {
  getById(id: string): Promise<Result<CarDto, CarDataSourceError>>;
  getByPage(params: {
    pageParam: number;
    pageLimit?: number;
    orderBy?: { column: CarOrderColumn; ascending: boolean };
  }): Promise<
    Result<
      { data: (CarDto | null)[]; nextPageParam: number | null },
      CarDataSourceError
    >
  >;
}
