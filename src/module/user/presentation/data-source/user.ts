import type { Result } from '@/common/application/result/result';
import type { UserDto } from '@/user/application/dto/user';

type UserDataSourceError = {
  message: string;
};

export interface UserDataSource {
  getById(id: string): Promise<Result<UserDto, UserDataSourceError>>;
  getUsersByIds(ids: string[]): Promise<Result<UserDto[], UserDataSourceError>>;
  getSessionUser(): Promise<Result<UserDto, UserDataSourceError>>;
}
