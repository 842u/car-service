import type { FetchClient } from '@/common/infrastructure/http/fetch-client';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { NextAuthApiClient } from '@/user/infrastructure/api/next-auth-api-client';

export function registerApiClientModule(container: DependencyContainer) {
  container.registerCached(
    tokens.AUTH_API_CLIENT,
    async (dependencyContainer) => {
      const fetchClient = await dependencyContainer.resolve<FetchClient>(
        tokens.HTTP_CLIENT,
      );

      return new NextAuthApiClient(fetchClient);
    },
  );
}
