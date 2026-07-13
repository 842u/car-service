import type { ServiceLog } from '@/car/service-log/domain/service-log/service-log';
import type { RepositoryResult } from '@/common/application/repository';

/**
 * Not yet `extends Repository<ServiceLog>`: that base interface mandates
 * `update`/`remove`, which have no caller until the Edit and Remove slices.
 * Widens to the full shape as those slices land.
 */
export interface ServiceLogRepository {
  store(model: ServiceLog): Promise<RepositoryResult<null>>;
  getById(id: string): Promise<RepositoryResult<ServiceLog>>;
}
