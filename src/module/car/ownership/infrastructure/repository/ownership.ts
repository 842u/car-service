import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import type { OwnershipRepository } from '@/car/ownership/application/repository/ownership';
import type { Ownership } from '@/car/ownership/domain/ownership/ownership';
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

    const ownershipResult = this._ownershipMapper.persistenceToDomain(
      queryResult.data,
    );

    if (!ownershipResult.success) {
      return Result.fail(ownershipResult.error);
    }

    return Result.ok(ownershipResult.data);
  }

  async addOwner(ownership: Ownership, newOwnerId: OwnerId) {
    const row = this._ownershipMapper.newCoOwnerToPersistence(
      ownership.id,
      newOwnerId,
    );

    const mutateResult = await this._dbClient.mutate(
      (from) => from('cars_ownerships').insert(row),
      1,
    );

    if (!mutateResult.success) {
      return Result.fail(mutateResult.error);
    }

    return Result.ok(null);
  }

  async removeOwner(ownership: Ownership, targetId: OwnerId) {
    const mutateResult = await this._dbClient.mutate(
      (from) =>
        from('cars_ownerships')
          .delete()
          .eq('car_id', ownership.id.value)
          .eq('owner_id', targetId.value),
      1,
    );

    if (!mutateResult.success) {
      return Result.fail(mutateResult.error);
    }

    return Result.ok(null);
  }

  async promotePrimary(ownership: Ownership, newPrimaryOwnerId: OwnerId) {
    const rpcResult = await this._dbClient.rpc(async (rpc) =>
      rpc('promote_primary_car_owner', {
        new_primary_owner_id: newPrimaryOwnerId.value,
        target_car_id: ownership.id.value,
      }),
    );

    if (!rpcResult.success) {
      return Result.fail(rpcResult.error);
    }

    return Result.ok(null);
  }
}
