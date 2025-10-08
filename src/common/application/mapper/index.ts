import type { Result } from '@/common/application/result';

export interface Mapper<TDomain, TDto, TPersistence> {
  domainToDto(model: TDomain): TDto;
  persistenceToDto(model: TPersistence): TDto;
  domainToPersistence(model: TDomain): TPersistence;
  dtoToPersistence(model: TDto): TPersistence;
  dtoToDomain(model: TDto): Result<TDomain, unknown>;
  persistenceToDomain(model: TPersistence): Result<TDomain, unknown>;
}
