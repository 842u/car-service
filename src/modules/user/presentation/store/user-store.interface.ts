import type { Result } from '@/common/application/result/result';
import type { UserDto } from '@/user/application/dto/user-dto';

type UserStoreError = {
  message: string;
};

export interface UserStore {
  getById(id: string): Promise<Result<UserDto, UserStoreError>>;
  getUsersByIds(ids: string[]): Promise<Result<UserDto[], UserStoreError>>;
  getSessionUser(): Promise<Result<UserDto, UserStoreError>>;
}
