import type {
  Repository,
  RepositoryResult,
} from '@/common/application/repository/repository.interface';
import type { User } from '@/user/domain/user/user';

export interface UserRepository extends Repository<User> {
  changeName(model: User): Promise<RepositoryResult<null>>;
  changeAvatarUrl(model: User): Promise<RepositoryResult<null>>;
  getByEmail(email: string): Promise<RepositoryResult<User>>;
  getById(id: string): Promise<RepositoryResult<User>>;
}
