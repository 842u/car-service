import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { UserRepository } from '@/user/infrastructure/repositories/user-repository';

export function registerRepositoriesModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.USER_REPOSITORY_ADMIN,
    async (dependencyContainer, config) => {
      const dbClient = await dependencyContainer.resolve(
        tokens.DATABASE_CLIENT_ADMIN,
        config,
      );
      const userMapper = await dependencyContainer.resolve(tokens.USER_MAPPER);

      return new UserRepository(dbClient, userMapper);
    },
  );

  container.registerFactory(
    tokens.USER_REPOSITORY_SERVER,
    async (dependencyContainer) => {
      const dbClient = await dependencyContainer.resolve(
        tokens.DATABASE_CLIENT_SERVER,
      );
      const userMapper = await dependencyContainer.resolve(tokens.USER_MAPPER);

      return new UserRepository(dbClient, userMapper);
    },
  );
}
