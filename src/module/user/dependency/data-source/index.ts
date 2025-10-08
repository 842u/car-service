import { browserAuthClient } from '@/dependencies/auth-client/browser';
import { browserDatabaseClient } from '@/dependencies/database-client/browser';
import { userMapper } from '@/user/dependency/mapper';
import { UserDataSourceImplementation } from '@/user/infrastructure/data-source/user';

export const userDataSource = new UserDataSourceImplementation(
  browserAuthClient,
  browserDatabaseClient,
  userMapper,
);
