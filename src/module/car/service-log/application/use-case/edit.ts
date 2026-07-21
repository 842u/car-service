import type { OwnershipVisibility } from '@/car/ownership/application/service/visibility';
import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';
import { canEdit } from '@/car/service-log/domain/policy/authorization';
import type { EditServiceLogApiRequest } from '@/car/service-log/interface/api/edit.schema';
import type { AuthClient } from '@/common/application/auth-client';
import {
  type ApplicationError,
  applicationError,
} from '@/common/application/error';
import { Result } from '@/common/application/result';
import type { UseCase } from '@/common/application/use-case';

export class EditServiceLogUseCase implements UseCase<
  EditServiceLogApiRequest,
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
    contract: EditServiceLogApiRequest,
  ): Promise<Result<ServiceLogDto, ApplicationError>> {
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

    if (!canEdit(serviceLog, ownership, actingId)) {
      return Result.fail(
        applicationError.forbidden(
          "Only this service log's author or the car's primary owner may edit it.",
        ),
      );
    }

    const editResult = serviceLog.edit({
      serviceDate: contract.serviceDate,
      categories: contract.categories,
      mileage: contract.mileage,
      note: contract.notes,
      serviceCost: contract.serviceCost,
    });

    if (!editResult.success) {
      const { message, issues } = editResult.error;
      return Result.fail(applicationError.validation(message, issues));
    }

    const updateResult = await this._serviceLogRepository.update(serviceLog);

    if (!updateResult.success) {
      const { message } = updateResult.error;
      return Result.fail(applicationError.unexpected(message));
    }

    return Result.ok(this._serviceLogMapper.domainToDto(serviceLog));
  }
}
