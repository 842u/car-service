import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { NextUserApiClient } from '@/user/infrastructure/api-client/next-user-api-client';

export function registerApiClientModule(container: DependencyContainer) {
  container.registerCached(
    tokens.USER_API_CLIENT,
    async (dependencyContainer) => {
      const fetchClient = await dependencyContainer.resolve(tokens.HTTP_CLIENT);
      const validator = await dependencyContainer.resolve(tokens.VALIDATOR);

      return new NextUserApiClient(fetchClient, validator);
    },
  );
}
