import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { UserStore } from '@/user/infrastructure/stores/user-store';

export function registerStoresModule(container: DependencyContainer) {
  container.registerFactory(tokens.USER_STORE, async (dependencyContainer) => {
    const authClient = await dependencyContainer.resolve(
      tokens.AUTH_BROWSER_CLIENT,
    );
    const dbClient = await dependencyContainer.resolve(
      tokens.DATABASE_BROWSER_CLIENT,
    );
    const userMapper = await dependencyContainer.resolve(tokens.USER_MAPPER);

    return new UserStore(authClient, dbClient, userMapper);
  });
}
