import { FetchClient } from '@/common/infrastructure/http/fetch-client';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';

export function registerHttpModule(container: DependencyContainer) {
  container.registerCached(tokens.HTTP_CLIENT, () => new FetchClient());
}
