import type { CarDto } from '@/car/application/dto/car';
import type { CarMapper } from '@/car/application/mapper/car';
import type { CarRepository } from '@/car/application/repository/car';
import type { EditCarApiRequest } from '@/car/interface/api/edit.schema';
import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';

export class EditCarUseCase implements UseCase<EditCarApiRequest, CarDto> {
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
    contract: EditCarApiRequest,
  ): Promise<Result<CarDto, ApplicationError>> {
    const sessionResult = await this._authClient.authenticate();

    if (!sessionResult.success) {
      const { message } = sessionResult.error;
      return Result.fail(applicationError.unauthorized(message));
    }

    const { carId } = contract;

    const getCarResult = await this._carRepository.getById(carId);

    if (!getCarResult.success) {
      const { message } = getCarResult.error;
      return Result.fail(applicationError.notFound(message));
    }

    const car = getCarResult.data;

    const editResult = car.edit(contract);

    if (!editResult.success) {
      const { message, issues } = editResult.error;
      return Result.fail(applicationError.validation(message, issues));
    }

    const updateResult = await this._carRepository.update(car);

    if (!updateResult.success) {
      const { message } = updateResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._carMapper.domainToDto(car));
  }
}
