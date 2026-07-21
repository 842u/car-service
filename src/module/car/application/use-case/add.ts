import type { CarDto } from '@/car/application/dto/car';
import type { CarMapper } from '@/car/application/mapper/car';
import type { CarProvisioning } from '@/car/application/provisioning/car';
import { Car } from '@/car/domain/car/car';
import { CarId } from '@/car/domain/car/value-object/car-id/car-id';
import type { AddCarApiRequest } from '@/car/interface/api/add.schema';
import { Ownership } from '@/car/ownership/domain/ownership/ownership';
import { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';
import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';

export class AddCarUseCase implements UseCase<AddCarApiRequest, CarDto> {
  private readonly _authClient: AuthClient;
  private readonly _carProvisioning: CarProvisioning;
  private readonly _carMapper: CarMapper;

  constructor(
    authClient: AuthClient,
    carProvisioning: CarProvisioning,
    carMapper: CarMapper,
  ) {
    this._authClient = authClient;
    this._carProvisioning = carProvisioning;
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

    const primaryOwnerIdResult = OwnerId.create(sessionResult.data.id);

    if (!primaryOwnerIdResult.success) {
      const { message } = primaryOwnerIdResult.error;
      return Result.fail(applicationError.unexpected(message));
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

    const ownershipResult = Ownership.create({
      carId: car.id,
      primaryOwnerId: primaryOwnerIdResult.data,
    });

    if (!ownershipResult.success) {
      return Result.fail(
        applicationError.unexpected('Failed to birth Ownership.'),
      );
    }

    const ownership = ownershipResult.data;

    const provisionResult = await this._carProvisioning.createWithPrimaryOwner(
      car,
      ownership,
    );

    if (!provisionResult.success) {
      const { message } = provisionResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._carMapper.domainToDto(car));
  }
}
