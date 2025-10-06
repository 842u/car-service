import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { UserRepositoryImplementation } from '@/user/infrastructure/repository/user-repository';

export function registerRepositoryModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.USER_REPOSITORY_ADMIN,
    async (dependencyContainer, config) => {
      const dbClientAdmin = await dependencyContainer.resolve(
        tokens.DATABASE_CLIENT_ADMIN,
        config,
      );
      const userMapper = await dependencyContainer.resolve(tokens.USER_MAPPER);

      return new UserRepositoryImplementation(dbClientAdmin, userMapper);
    },
  );

  container.registerFactory(
    tokens.USER_REPOSITORY_SERVER,
    async (dependencyContainer) => {
      const dbClient = await dependencyContainer.resolve(
        tokens.DATABASE_CLIENT_SERVER,
      );
      const userMapper = await dependencyContainer.resolve(tokens.USER_MAPPER);

      return new UserRepositoryImplementation(dbClient, userMapper);
    },
  );
}
