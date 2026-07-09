import type { CarDto } from '@/car/application/dto/car';
import type { AddCarApiRequest } from '@/car/interface/api/add.schema';
import type { Result } from '@/common/application/result';

type CarApiClientError = { message: string };

export interface CarApiClient {
  add(contract: AddCarApiRequest): Promise<Result<CarDto, CarApiClientError>>;
}
