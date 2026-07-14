import type { CarOwnershipReader } from '@/car/service-log/application/reader/car-ownership';
import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';
import { canModify } from '@/car/service-log/domain/policy/authorization';
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
  private readonly _carOwnershipReader: CarOwnershipReader;
  private readonly _serviceLogRepository: ServiceLogRepository;

  constructor(
    authClient: AuthClient,
    carOwnershipReader: CarOwnershipReader,
    serviceLogRepository: ServiceLogRepository,
  ) {
    this._authClient = authClient;
    this._carOwnershipReader = carOwnershipReader;
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
      const { message } = getServiceLogResult.error;
      return Result.fail(applicationError.notFound(message));
    }

    const serviceLog = getServiceLogResult.data;

    // The common case (self-delete) costs one query: the author is always
    // permitted, so ownership is only loaded when it might change the
    // outcome.
    if (!serviceLog.isAuthoredBy(actingId)) {
      const getOwnershipResult = await this._carOwnershipReader.getByCarId(
        serviceLog.carId.value,
      );

      if (!getOwnershipResult.success) {
        const { message } = getOwnershipResult.error;
        return Result.fail(applicationError.notFound(message));
      }

      const carOwnership = getOwnershipResult.data;

      if (!canModify(serviceLog, carOwnership, actingId)) {
        return Result.fail(
          applicationError.unauthorized(
            "Only this service log's author or the car's primary owner may remove it.",
          ),
        );
      }
    }

    const removeResult = await this._serviceLogRepository.remove(serviceLog);

    if (!removeResult.success) {
      const { message } = removeResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(null);
  }
}
