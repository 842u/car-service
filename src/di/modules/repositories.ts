import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { UserRepository } from '@/user/infrastructure/repositories/user-repository';

export function registerRepositoriesModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.USER_REPOSITORY,
    async (dependencyContainer, config) => {
      const dbClient = await dependencyContainer.resolve(
        tokens.DATABASE_ADMIN_CLIENT,
        config,
      );
      const userMapper = await dependencyContainer.resolve(tokens.USER_MAPPER);

      return new UserRepository(dbClient, userMapper);
    },
  );
}
