import type { CarDto } from '@/car/application/dto/car';
import type { CarMapper } from '@/car/application/mapper/car';
import type { CarRepository } from '@/car/application/repository/car';
import { Car } from '@/car/domain/car/car';
import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import type { AddCarApiRequest } from '@/car/interface/api/add.schema';
import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';

export class AddCarUseCase implements UseCase<AddCarApiRequest, CarDto> {
  private readonly _authClient: AuthClient;
  private readonly _carRepository: CarRepository;
  private readonly _carMapper: CarMapper;

  constructor(
    authClient: AuthClient,
    carRepository: CarRepository,
    carMapper: CarMapper,
  ) {
    this._authClient = authClient;
    this._carRepository = carRepository;
    this._carMapper = carMapper;
  }

  async execute(
    contract: AddCarApiRequest,
  ): Promise<Result<CarDto, ApplicationError>> {
    const sessionResult = await this._authClient.authenticate();

    if (!sessionResult.success) {
      const { message } = sessionResult.error;
      return Result.fail(applicationError.unauthorized(message));
    }

    const carResult = Car.create({
      id: CarId.generate().value,
      ...contract,
    });

    if (!carResult.success) {
      const { message, issues } = carResult.error;
      return Result.fail(applicationError.validation(message, issues));
    }

    const car = carResult.data;

    const storeResult = await this._carRepository.store(car);

    if (!storeResult.success) {
      const { message } = storeResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._carMapper.domainToDto(car));
  }
}
