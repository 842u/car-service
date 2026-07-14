import type { ServiceLog } from '@/car/service-log/domain/service-log/service-log';
import type { RepositoryResult } from '@/common/application/repository';

/**
 * Not yet `extends Repository<ServiceLog>`: that base interface also
 * mandates `remove`, which has no caller until the Remove slice. Widens to
 * the full shape once that slice lands.
 */
export interface ServiceLogRepository {
  store(model: ServiceLog): Promise<RepositoryResult<null>>;
  getById(id: string): Promise<RepositoryResult<ServiceLog>>;
  update(model: ServiceLog): Promise<RepositoryResult<null>>;
}
