import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { UserDataSourceImplementation } from '@/user/infrastructure/data-source/user-data-source';

export function registerDataSourceModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.USER_DATA_SOURCE,
    async (dependencyContainer) => {
      const authClient = await dependencyContainer.resolve(
        tokens.AUTH_CLIENT_BROWSER,
      );
      const dbClient = await dependencyContainer.resolve(
        tokens.DATABASE_CLIENT_BROWSER,
      );
      const userMapper = await dependencyContainer.resolve(tokens.USER_MAPPER);

      return new UserDataSourceImplementation(authClient, dbClient, userMapper);
    },
  );
}
