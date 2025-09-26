import type {
  Repository,
  RepositoryResult,
} from '@/common/application/repositories/repository.interface';
import type { User } from '@/user/domain/user/user';

export interface IUserRepository extends Repository<User> {
  changeName(model: User): Promise<RepositoryResult>;
  changeAvatarUrl(model: User): Promise<RepositoryResult>;
  getByEmail(email: string): Promise<RepositoryResult>;
  getById(id: string): Promise<RepositoryResult>;
}
