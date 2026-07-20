import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import type { OwnershipReader } from '@/car/service-log/application/reader/ownership';
import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';
import { canModify } from '@/car/service-log/domain/policy/authorization';
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
  private readonly _ownershipReader: OwnershipReader;
  private readonly _serviceLogRepository: ServiceLogRepository;
  private readonly _serviceLogMapper: ServiceLogMapper;

  constructor(
    authClient: AuthClient,
    ownershipReader: OwnershipReader,
    serviceLogRepository: ServiceLogRepository,
    serviceLogMapper: ServiceLogMapper,
  ) {
    this._authClient = authClient;
    this._ownershipReader = ownershipReader;
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
      const { message } = getServiceLogResult.error;
      return Result.fail(applicationError.notFound(message));
    }

    const serviceLog = getServiceLogResult.data;

    // The common case (self-edit) costs one query: the author is always
    // permitted, so ownership is only loaded when it might change the
    // outcome.
    if (!serviceLog.isAuthoredBy(actingId)) {
      const getOwnershipResult = await this._ownershipReader.getByCarId(
        serviceLog.carId.value,
      );

      if (!getOwnershipResult.success) {
        const { message } = getOwnershipResult.error;
        return Result.fail(applicationError.notFound(message));
      }

      const ownership = getOwnershipResult.data;

      if (!canModify(serviceLog, ownership, actingId)) {
        return Result.fail(
          applicationError.unauthorized(
            "Only this service log's author or the car's primary owner may edit it.",
          ),
        );
      }
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
