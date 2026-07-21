import type { CarRepository } from '@/car/application/repository/car';
import { canRemove } from '@/car/domain/policy/authorization';
import type { RemoveCarApiRequest } from '@/car/interface/api/remove.schema';
import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';

export class RemoveCarUseCase implements UseCase<RemoveCarApiRequest, null> {
  private readonly _authClient: AuthClient;
  private readonly _ownershipVisibility: OwnershipVisibility;
  private readonly _carRepository: CarRepository;

  constructor(
    authClient: AuthClient,
    ownershipVisibility: OwnershipVisibility,
    carRepository: CarRepository,
  ) {
    this._authClient = authClient;
    this._ownershipVisibility = ownershipVisibility;
    this._carRepository = carRepository;
  }

  async execute(
    contract: RemoveCarApiRequest,
  ): Promise<Result<null, ApplicationError>> {
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

    if (!canRemove(ownership, actingId)) {
      return Result.fail(
        applicationError.forbidden(
          'Only the primary owner may remove this car.',
        ),
      );
    }

    const getCarResult = await this._carRepository.getById(carId);

    if (!getCarResult.success) {
      const { message } = getCarResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    const car = getCarResult.data;

    const removeResult = await this._carRepository.remove(car);

    if (!removeResult.success) {
      const { message } = removeResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(null);
  }
}
