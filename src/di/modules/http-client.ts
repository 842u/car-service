import { FetchHttpClient } from '@/common/infrastructure/http-client/fetch-http-client';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';

export function registerHttpClientModule(container: DependencyContainer) {
  container.registerFactory(tokens.HTTP_CLIENT, () => new FetchHttpClient());
}
