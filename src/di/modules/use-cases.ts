import { dependencyTokens } from '@/di';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { SignUpUserUseCase } from '@/user/application/use-cases/sign-up-user-use-case';

export function registerUseCasesModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.SIGN_UP_USER_USE_CASE,
    async (dependencyContainer, config) => {
      const authClient = await dependencyContainer.resolve(
        dependencyTokens.AUTH_SERVER_CLIENT,
        config,
      );
      const authAdminClient = await dependencyContainer.resolve(
        dependencyTokens.AUTH_SERVER_CLIENT,
        config,
      );
      const userRepository = await dependencyContainer.resolve(
        dependencyTokens.USER_REPOSITORY,
        config,
      );

      return new SignUpUserUseCase(authClient, authAdminClient, userRepository);
    },
  );
}
