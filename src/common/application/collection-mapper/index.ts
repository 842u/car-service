import type { Result } from '@/common/application/result';

export interface CollectionMapper<TDomain, TDto, TPersistence> {
  persistenceToDto(row: TPersistence): TDto;
  persistenceToDomain(rows: TPersistence[]): Result<TDomain | null, unknown>;
  domainToDto(model: TDomain): TDto[];
}
