import type { CarDto } from '@/car/application/dto/car';
import type { AddCarApiRequest } from '@/car/interface/api/add.schema';
import type { EditCarApiRequest } from '@/car/interface/api/edit.schema';
import type { Result } from '@/common/application/result';
import type { ValidatorIssue } from '@/common/application/validator';

type CarApiClientError = {
  message: string;
  issues?: ValidatorIssue[];
};

export interface CarApiClient {
  add(contract: AddCarApiRequest): Promise<Result<CarDto, CarApiClientError>>;
  edit(contract: EditCarApiRequest): Promise<Result<CarDto, CarApiClientError>>;
  remove(carId: string): Promise<Result<null, CarApiClientError>>;
}
