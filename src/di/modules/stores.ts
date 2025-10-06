import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { UserStoreImplementation } from '@/user/infrastructure/store/user-store';

export function registerStoresModule(container: DependencyContainer) {
  container.registerFactory(tokens.USER_STORE, async (dependencyContainer) => {
    const authClient = await dependencyContainer.resolve(
      tokens.AUTH_CLIENT_BROWSER,
    );
    const dbClient = await dependencyContainer.resolve(
      tokens.DATABASE_CLIENT_BROWSER,
    );
    const userMapper = await dependencyContainer.resolve(tokens.USER_MAPPER);

    return new UserStoreImplementation(authClient, dbClient, userMapper);
  });
}
