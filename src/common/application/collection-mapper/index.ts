import type { Result } from '@/common/application/result';

export interface CollectionMapper<TDomain, TDto, TPersistenceRow> {
  persistenceToDto(row: TPersistenceRow): TDto;
  persistenceToDomain(rows: TPersistenceRow[]): Result<TDomain | null, unknown>;
  domainToDto(model: TDomain): TDto[];
}
