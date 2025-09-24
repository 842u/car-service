import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { UserMapper } from '@/user/application/mappers/user-mapper';

export function registerMappersModule(container: DependencyContainer) {
  container.registerFactory(tokens.USER_MAPPER, () => new UserMapper());
}
