import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { UserRepository } from '@/user/infrastructure/repositories/user-repository';

export function registerRepositoriesModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.USER_REPOSITORY,
    async (dependencyContainer) => {
      const dbClient = await dependencyContainer.resolve(
        tokens.DATABASE_SERVER_CLIENT,
      );

      return new UserRepository(dbClient);
    },
  );
}
