import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import type { ServiceLogRepository } from '@/car/service-log/application/repository/service-log';
import type { ServiceLog } from '@/car/service-log/domain/service-log/service-log';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';

export class ServiceLogRepositoryImplementation implements ServiceLogRepository {
  private readonly _dbClient: SupabaseDatabaseClient;
  private readonly _serviceLogMapper: ServiceLogMapper;

  constructor(
    dbClient: SupabaseDatabaseClient,
    serviceLogMapper: ServiceLogMapper,
  ) {
    this._dbClient = dbClient;
    this._serviceLogMapper = serviceLogMapper;
  }

  async store(serviceLog: ServiceLog) {
    const serviceLogPersistence =
      this._serviceLogMapper.domainToPersistence(serviceLog);

    const queryResult = await this._dbClient.query(async (from) =>
      from('service_logs').insert(serviceLogPersistence),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }

  async update(serviceLog: ServiceLog) {
    const serviceLogPersistence =
      this._serviceLogMapper.domainToPersistence(serviceLog);

    const queryResult = await this._dbClient.query(async (from) =>
      from('service_logs')
        .update(serviceLogPersistence)
        .eq('id', serviceLog.id.value),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }

  async remove(serviceLog: ServiceLog) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('service_logs').delete().eq('id', serviceLog.id.value),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }

  async getById(id: string) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('service_logs').select('*').eq('id', id).single(),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    const serviceLogPersistence = queryResult.data;

    const serviceLogResult = this._serviceLogMapper.persistenceToDomain(
      serviceLogPersistence,
    );

    if (!serviceLogResult.success) {
      return Result.fail(serviceLogResult.error);
    }

    return Result.ok(serviceLogResult.data);
  }
}
