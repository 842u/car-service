import type { CarDto } from '@/car/application/dto/car';
import type { AddCarApiRequest } from '@/car/interface/api/add.schema';
import type { EditCarApiRequest } from '@/car/interface/api/edit.schema';
import type { ApiResponseError } from '@/common/application/api-response';
import type { Result } from '@/common/application/result';

/** The requester forwards the api error envelope unchanged. */
type CarApiClientError = ApiResponseError;

export interface CarApiClient {
  add(contract: AddCarApiRequest): Promise<Result<CarDto, CarApiClientError>>;
  edit(contract: EditCarApiRequest): Promise<Result<CarDto, CarApiClientError>>;
  remove(carId: string): Promise<Result<null, CarApiClientError>>;
}
