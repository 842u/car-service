import { browserAuthClient } from '@/dependency/auth-client/browser';
import { browserDatabaseClient } from '@/dependency/database-client/browser';
import { userMapper } from '@/user/dependency/mapper';
import { UserDataSourceImplementation } from '@/user/infrastructure/data-source/user';

export const userDataSource = new UserDataSourceImplementation(
  browserAuthClient,
  browserDatabaseClient,
  userMapper,
);
