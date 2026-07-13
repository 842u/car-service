import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import type { OwnershipDataSource } from '@/car/ownership/presentation/data-source/ownership';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';

export class OwnershipDataSourceImplementation implements OwnershipDataSource {
  private readonly _dbClient: SupabaseDatabaseClient;
  private readonly _ownershipMapper: OwnershipMapper;

  constructor(
    dbClient: SupabaseDatabaseClient,
    ownershipMapper: OwnershipMapper,
  ) {
    this._dbClient = dbClient;
    this._ownershipMapper = ownershipMapper;
  }

  async getByCarId(carId: string) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('cars_ownerships')
        .select('*')
        .eq('car_id', carId)
        .order('created_at', { ascending: false }),
    );

    if (!queryResult.success) {
      const { message } = queryResult.error;
      return Result.fail({ message });
    }

    const ownershipsDto = queryResult.data.map((row) =>
      this._ownershipMapper.persistenceToDto(row),
    );

    return Result.ok(ownershipsDto);
  }

  async getByOwnerId(ownerId: string) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('cars_ownerships').select('*').eq('owner_id', ownerId),
    );

    if (!queryResult.success) {
      const { message } = queryResult.error;
      return Result.fail({ message });
    }

    const ownershipsDto = queryResult.data.map((row) =>
      this._ownershipMapper.persistenceToDto(row),
    );

    return Result.ok(ownershipsDto);
  }
}
