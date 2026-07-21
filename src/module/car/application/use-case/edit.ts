import type { CarDto } from '@/car/application/dto/car';
import type { CarMapper } from '@/car/application/mapper/car';
import type { CarRepository } from '@/car/application/repository/car';
import { canEdit } from '@/car/domain/policy/authorization';
import type { EditCarApiRequest } from '@/car/interface/api/edit.schema';
import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';

export class EditCarUseCase implements UseCase<EditCarApiRequest, CarDto> {
  private readonly _authClient: AuthClient;
  private readonly _ownershipVisibility: OwnershipVisibility;
  private readonly _carRepository: CarRepository;
  private readonly _carMapper: CarMapper;

  constructor(
    authClient: AuthClient,
    ownershipVisibility: OwnershipVisibility,
    carRepository: CarRepository,
    carMapper: CarMapper,
  ) {
    this._authClient = authClient;
    this._ownershipVisibility = ownershipVisibility;
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

    const actingId = sessionResult.data.id;
    const { carId } = contract;

    const visibilityResult = await this._ownershipVisibility.resolve(
      carId,
      actingId,
    );

    if (!visibilityResult.success) {
      return Result.fail(visibilityResult.error);
    }

    const ownership = visibilityResult.data;

    if (!canEdit(ownership, actingId)) {
      return Result.fail(
        applicationError.forbidden('Only the primary owner may edit this car.'),
      );
    }

    const getCarResult = await this._carRepository.getById(carId);

    if (!getCarResult.success) {
      const { message } = getCarResult.error;
      return Result.fail(applicationError.unexpected(message));
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
