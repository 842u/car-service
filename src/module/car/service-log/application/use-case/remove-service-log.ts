import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';
import { canRemove } from '@/car/service-log/domain/policy/authorization';
import type { RemoveServiceLogApiRequest } from '@/car/service-log/interface/api/remove.schema';
import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';

export class RemoveServiceLogUseCase implements UseCase<
  RemoveServiceLogApiRequest,
  null
> {
  private readonly _authClient: AuthClient;
  private readonly _ownershipVisibility: OwnershipVisibility;
  private readonly _serviceLogRepository: ServiceLogRepository;

  constructor(
    authClient: AuthClient,
    ownershipVisibility: OwnershipVisibility,
    serviceLogRepository: ServiceLogRepository,
  ) {
    this._authClient = authClient;
    this._ownershipVisibility = ownershipVisibility;
    this._serviceLogRepository = serviceLogRepository;
  }

  async execute(
    contract: RemoveServiceLogApiRequest,
  ): Promise<Result<null, ApplicationError>> {
    const sessionResult = await this._authClient.authenticate();

    if (!sessionResult.success) {
      const { message } = sessionResult.error;
      return Result.fail(applicationError.unauthorized(message));
    }

    const actingId = sessionResult.data.id;

    const getServiceLogResult = await this._serviceLogRepository.getById(
      contract.serviceLogId,
    );

    if (!getServiceLogResult.success) {
      return Result.fail(applicationError.notFound('Service log not found.'));
    }

    const serviceLog = getServiceLogResult.data;

    const visibilityResult = await this._ownershipVisibility.resolve(
      serviceLog.carId.value,
      actingId,
    );

    if (!visibilityResult.success) {
      return Result.fail(applicationError.notFound('Service log not found.'));
    }

    const ownership = visibilityResult.data;

    if (!canRemove(serviceLog, ownership, actingId)) {
      return Result.fail(
        applicationError.forbidden(
          "Only this service log's author or the car's primary owner may remove it.",
        ),
      );
    }

    const removeResult = await this._serviceLogRepository.remove(serviceLog);

    if (!removeResult.success) {
      const { message } = removeResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(null);
  }
}
