import type { CarMapper } from '@/car/application/mapper/car';
import type { CarProvisioning } from '@/car/application/provisioning/car';
import type { Car } from '@/car/domain/car/car';
import type { OwnershipMapper } from '@/car/ownership/application/mapper/ownership';
import type { CarOwnership } from '@/car/ownership/domain/ownership/car-ownership';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';

export class CarProvisioningImplementation implements CarProvisioning {
  private readonly _dbClient: SupabaseDatabaseClient;
  private readonly _carMapper: CarMapper;
  private readonly _ownershipMapper: OwnershipMapper;

  constructor(
    dbClient: SupabaseDatabaseClient,
    carMapper: CarMapper,
    ownershipMapper: OwnershipMapper,
  ) {
    this._dbClient = dbClient;
    this._carMapper = carMapper;
    this._ownershipMapper = ownershipMapper;
  }

  async createWithPrimaryOwner(car: Car, primaryOwnership: CarOwnership) {
    const carPersistence = this._carMapper.domainToPersistence(car);
    const primaryOwnerPersistence =
      this._ownershipMapper.primaryOwnerToPersistence(
        primaryOwnership.id,
        primaryOwnership.primaryOwner,
      );

    const rpcResult = await this._dbClient.rpc(async (rpc) =>
      rpc('create_car_with_primary_owner', {
        car: carPersistence,
        primary_owner: primaryOwnerPersistence,
      }),
    );

    if (!rpcResult.success) {
      return Result.fail(rpcResult.error);
    }

    return Result.ok(null);
  }
}
