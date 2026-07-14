import type { ServiceLog } from '@/car/service-log/domain/service-log/service-log';
import type {
  Repository,
  RepositoryResult,
} from '@/common/application/repository';

export interface ServiceLogRepository extends Repository<ServiceLog> {
  getById(id: string): Promise<RepositoryResult<ServiceLog>>;
}
