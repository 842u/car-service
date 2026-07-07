import type {
  Repository,
  RepositoryResult,
} from '@/common/application/repository';
import type { User } from '@/user/domain/user/user';

export interface UserRepository extends Repository<User> {
  getById(id: string): Promise<RepositoryResult<User>>;
}
