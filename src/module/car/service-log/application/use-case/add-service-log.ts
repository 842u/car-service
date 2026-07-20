import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';
import { ServiceLog } from '@/car/service-log/domain/service-log/service-log';
import { ServiceLogId } from '@/car/service-log/domain/service-log/value-object/service-log-id/service-log-id';
import type { AddServiceLogApiRequest } from '@/car/service-log/interface/api/add.schema';
import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';

export class AddServiceLogUseCase implements UseCase<
  AddServiceLogApiRequest,
  ServiceLogDto
> {
  private readonly _authClient: AuthClient;
  private readonly _ownershipVisibility: OwnershipVisibility;
  private readonly _serviceLogRepository: ServiceLogRepository;
  private readonly _serviceLogMapper: ServiceLogMapper;

  constructor(
    authClient: AuthClient,
    ownershipVisibility: OwnershipVisibility,
    serviceLogRepository: ServiceLogRepository,
    serviceLogMapper: ServiceLogMapper,
  ) {
    this._authClient = authClient;
    this._ownershipVisibility = ownershipVisibility;
    this._serviceLogRepository = serviceLogRepository;
    this._serviceLogMapper = serviceLogMapper;
  }

  async execute(
    contract: AddServiceLogApiRequest,
  ): Promise<Result<ServiceLogDto, ApplicationError>> {
    const sessionResult = await this._authClient.authenticate();

    if (!sessionResult.success) {
      const { message } = sessionResult.error;
      return Result.fail(applicationError.unauthorized(message));
    }

    const actingId = sessionResult.data.id;

    const visibilityResult = await this._ownershipVisibility.resolve(
      contract.carId,
      actingId,
    );

    if (!visibilityResult.success) {
      return Result.fail(visibilityResult.error);
    }

    const serviceLogResult = ServiceLog.create({
      id: ServiceLogId.generate().value,
      carId: contract.carId,
      authorId: actingId,
      serviceDate: contract.serviceDate,
      categories: contract.categories,
      mileage: contract.mileage,
      note: contract.notes,
      serviceCost: contract.serviceCost,
    });

    if (!serviceLogResult.success) {
      const { message, issues } = serviceLogResult.error;
      return Result.fail(applicationError.validation(message, issues));
    }

    const serviceLog = serviceLogResult.data;

    const storeResult = await this._serviceLogRepository.store(serviceLog);

    if (!storeResult.success) {
      const { message } = storeResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._serviceLogMapper.domainToDto(serviceLog));
  }
}
