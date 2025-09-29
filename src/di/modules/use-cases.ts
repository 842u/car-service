import { dependencyTokens } from '@/di';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { SignInUserWithOAuthUseCase } from '@/user/application/use-cases/sign-in-with-o-auth';
import { SignInUserWithOtpUseCase } from '@/user/application/use-cases/sign-in-with-otp';
import { SignUpUserUseCase } from '@/user/application/use-cases/sign-up-user-use-case';

export function registerUseCasesModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.SIGN_UP_USER_USE_CASE,
    async (dependencyContainer, config) => {
      const authAdminClient = await dependencyContainer.resolve(
        dependencyTokens.AUTH_ADMIN_CLIENT,
        config,
      );
      const userRepository = await dependencyContainer.resolve(
        dependencyTokens.USER_REPOSITORY,
        config,
      );

      return new SignUpUserUseCase(authAdminClient, userRepository);
    },
  );

  container.registerFactory(
    tokens.SIGN_IN_USER_WITH_O_AUTH_USE_CASE,
    async (dependencyContainer, config) => {
      const authClient = await dependencyContainer.resolve(
        dependencyTokens.AUTH_SERVER_CLIENT,
      );
      const userRepository = await dependencyContainer.resolve(
        dependencyTokens.USER_REPOSITORY,
        config,
      );
      const userMapper = await dependencyContainer.resolve(
        dependencyTokens.USER_MAPPER,
      );

      return new SignInUserWithOAuthUseCase(
        authClient,
        userRepository,
        userMapper,
      );
    },
  );

  container.registerFactory(
    tokens.SIGN_IN_USER_WITH_OTP_USE_CASE,
    async (dependencyContainer) => {
      const authClient = await dependencyContainer.resolve(
        dependencyTokens.AUTH_SERVER_CLIENT,
      );
      const userMapper = await dependencyContainer.resolve(
        dependencyTokens.USER_MAPPER,
      );

      return new SignInUserWithOtpUseCase(authClient, userMapper);
    },
  );
}
