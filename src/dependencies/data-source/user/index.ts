import { browserAuthClient } from '@/dependencies/auth-client/browser';
import { browserDatabaseClient } from '@/dependencies/database-client/browser';
import { userMapper } from '@/dependencies/mapper/user';
import { UserDataSourceImplementation } from '@/user/infrastructure/data-source/user';

export const userDataSource = new UserDataSourceImplementation(
  browserAuthClient,
  browserDatabaseClient,
  userMapper,
);
