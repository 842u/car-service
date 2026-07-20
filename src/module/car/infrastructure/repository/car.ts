import type { CarMapper } from '@/car/application/mapper/car';
import type { CarRepository } from '@/car/application/repository/car';
import type { Car } from '@/car/domain/car/car';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';

export class CarRepositoryImplementation implements CarRepository {
  private readonly _dbClient: SupabaseDatabaseClient;
  private readonly _carMapper: CarMapper;

  constructor(dbClient: SupabaseDatabaseClient, carMapper: CarMapper) {
    this._dbClient = dbClient;
    this._carMapper = carMapper;
  }

  async store(car: Car) {
    const carPersistence = this._carMapper.domainToPersistence(car);

    const mutateResult = await this._dbClient.mutate(
      (from) => from('cars').insert(carPersistence),
      1,
    );

    if (!mutateResult.success) {
      return Result.fail(mutateResult.error);
    }

    return Result.ok(null);
  }

  async remove(car: Car) {
    const mutateResult = await this._dbClient.mutate(
      (from) => from('cars').delete().eq('id', car.id.value),
      1,
    );

    if (!mutateResult.success) {
      return Result.fail(mutateResult.error);
    }

    return Result.ok(null);
  }

  async getById(id: string) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('cars').select('*').eq('id', id).single(),
    );

    if (!queryResult.success) {
      return Result.fail(queryResult.error);
    }

    const carPersistence = queryResult.data;

    const carResult = this._carMapper.persistenceToDomain(carPersistence);

    if (!carResult.success) {
      return Result.fail(carResult.error);
    }

    return Result.ok(carResult.data);
  }

  async update(car: Car) {
    const carPersistence = this._carMapper.domainToPersistence(car);

    const mutateResult = await this._dbClient.mutate(
      (from) => from('cars').update(carPersistence).eq('id', car.id.value),
      1,
    );

    if (!mutateResult.success) {
      return Result.fail(mutateResult.error);
    }

    return Result.ok(null);
  }
}
