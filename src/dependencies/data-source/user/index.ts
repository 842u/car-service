import { authClientBrowser } from '@/dependencies/auth-client/browser';
import { databaseClientBrowser } from '@/dependencies/database-client/browser';
import { userMapper } from '@/dependencies/mapper/user';
import { UserDataSourceImplementation } from '@/user/infrastructure/data-source/user';

export const userDataSource = new UserDataSourceImplementation(
  authClientBrowser,
  databaseClientBrowser,
  userMapper,
);
