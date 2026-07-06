import type { Result } from '@/common/application/result';

export interface Mapper<TDomain, TDto, TPersistence> {
  domainToDto(model: TDomain): TDto;
  persistenceToDto(model: TPersistence): TDto;
  domainToPersistence(model: TDomain): TPersistence;
  persistenceToDomain(model: TPersistence): Result<TDomain, unknown>;
}
