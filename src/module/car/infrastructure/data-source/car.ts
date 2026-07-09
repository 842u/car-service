import type { CarMapper } from '@/car/application/mapper/car';
import type { CarPersistence } from '@/car/application/persistence-model/car';
import type { CarDataSource } from '@/car/presentation/data-source/car';
import { Result } from '@/common/application/result';
import type { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase';

export const CARS_INFINITE_QUERY_PAGE_DATA_LIMIT = 15;

const ORDER_COLUMN_TO_PERSISTENCE_COLUMN = {
  createdAt: 'created_at',
  insuranceExpiration: 'insurance_expiration',
  technicalInspectionExpiration: 'technical_inspection_expiration',
} as const satisfies Record<string, keyof CarPersistence>;

export class CarDataSourceImplementation implements CarDataSource {
  private readonly _dbClient: SupabaseDatabaseClient;
  private readonly _carMapper: CarMapper;

  constructor(dbClient: SupabaseDatabaseClient, carMapper: CarMapper) {
    this._dbClient = dbClient;
    this._carMapper = carMapper;
  }

  async getById(id: string) {
    const queryResult = await this._dbClient.query(async (from) =>
      from('cars').select('*').eq('id', id).single(),
    );

    if (!queryResult.success) {
      const { message } = queryResult.error;
      return Result.fail({ message });
    }

    const carDto = this._carMapper.persistenceToDto(queryResult.data);

    return Result.ok(carDto);
  }

  async getByPage({
    pageParam,
    pageLimit = CARS_INFINITE_QUERY_PAGE_DATA_LIMIT,
    orderBy = { column: 'createdAt', ascending: false },
  }: {
    pageParam: number;
    pageLimit?: number;
    orderBy?: {
      column: keyof typeof ORDER_COLUMN_TO_PERSISTENCE_COLUMN;
      ascending: boolean;
    };
  }) {
    const persistenceColumn =
      ORDER_COLUMN_TO_PERSISTENCE_COLUMN[orderBy.column];

    const rangeIndexFrom = pageParam * pageLimit;
    const rangeIndexTo = (pageParam + 1) * pageLimit - 1;

    const queryResult = await this._dbClient.query(async (from) =>
      from('cars')
        .select('*')
        .not(persistenceColumn, 'is', null)
        .order(persistenceColumn, { ascending: orderBy.ascending })
        .limit(pageLimit)
        .range(rangeIndexFrom, rangeIndexTo),
    );

    if (!queryResult.success) {
      const { message } = queryResult.error;
      return Result.fail({ message });
    }

    const { data } = queryResult;

    const carsDto = data.map((carPersistence) =>
      this._carMapper.persistenceToDto(carPersistence),
    );

    const hasMoreCars = !(data.length < pageLimit);

    return Result.ok({
      data: carsDto,
      nextPageParam: hasMoreCars ? pageParam + 1 : null,
    });
  }
}
