import type { ServiceLogMapper } from '@/car/service-log/application/mapper/service-log';
import type { ServiceLogDataSource } from '@/car/service-log/presentation/data-source/service-log';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';

export class ServiceLogDataSourceImplementation implements ServiceLogDataSource {
  private readonly _dbClient: SupabaseDatabaseClient;
  private readonly _serviceLogMapper: ServiceLogMapper;

  constructor(
    dbClient: SupabaseDatabaseClient,
    serviceLogMapper: ServiceLogMapper,
  ) {
    this._dbClient = dbClient;
    this._serviceLogMapper = serviceLogMapper;
  }

  async getByCarId(carId: string) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('service_logs')
        .select('*')
        .eq('car_id', carId)
        .order('service_date', { ascending: false })
        .order('created_at', { ascending: false }),
    );

    if (!queryResult.success) {
      const { message } = queryResult.error;
      return Result.fail({ message });
    }

    const serviceLogsDto = queryResult.data.map((row) =>
      this._serviceLogMapper.persistenceToDto(row),
    );

    return Result.ok(serviceLogsDto);
  }

  async getAll() {
    const queryResult = await this._dbClient.query(async (from) =>
      from('service_logs')
        .select('*')
        .order('service_date', { ascending: false })
        .order('created_at', { ascending: false }),
    );

    if (!queryResult.success) {
      const { message } = queryResult.error;
      return Result.fail({ message });
    }

    const serviceLogsDto = queryResult.data.map((row) =>
      this._serviceLogMapper.persistenceToDto(row),
    );

    return Result.ok(serviceLogsDto);
  }
}
