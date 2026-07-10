import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import type { CarOwnership } from '@/car/ownership/domain/ownership/car-ownership';
import type { OwnerId } from '@/car/ownership/domain/ownership/value-object/owner-id/owner-id';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';

export class OwnershipRepositoryImplementation implements OwnershipRepository {
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
      from('cars_ownerships').select('*').eq('car_id', carId),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    const carOwnershipResult = this._ownershipMapper.persistenceToDomain(
      queryResult.data,
    );

    if (!carOwnershipResult.success) {
      return Result.fail(carOwnershipResult.error);
    }

    return Result.ok(carOwnershipResult.data);
  }

  async addOwner(carOwnership: CarOwnership, newOwnerId: OwnerId) {
    const row = this._ownershipMapper.newCoOwnerToPersistence(
      carOwnership.id,
      newOwnerId,
    );

    const queryResult = await this._dbClient.query(async (from) =>
      from('cars_ownerships').insert(row),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    return Result.ok(null);
  }
}
