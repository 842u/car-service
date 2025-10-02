import { dependencyTokens } from '@/di';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { UserNameChangeUseCase } from '@/user/application/use-cases/name-change';
import { UserPasswordChangeUseCase } from '@/user/application/use-cases/password-change';
import { SignInUserWithOAuthUseCase } from '@/user/application/use-cases/sign-in-with-o-auth';
import { SignInUserWithOtpUseCase } from '@/user/application/use-cases/sign-in-with-otp';
import { SignUpUserUseCase } from '@/user/application/use-cases/sign-up-user-use-case';

export function registerUseCasesModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.SIGN_UP_USER_USE_CASE,
    async (dependencyContainer, config) => {
      const authClientAdmin = await dependencyContainer.resolve(
        dependencyTokens.AUTH_CLIENT_ADMIN,
        config,
      );
      const userRepositoryAdmin = await dependencyContainer.resolve(
        dependencyTokens.USER_REPOSITORY_ADMIN,
        config,
      );

      return new SignUpUserUseCase(authClientAdmin, userRepositoryAdmin);
    },
  );

  container.registerFactory(
    tokens.SIGN_IN_USER_WITH_O_AUTH_USE_CASE,
    async (dependencyContainer) => {
      const authClientServer = await dependencyContainer.resolve(
        dependencyTokens.AUTH_CLIENT_SERVER,
      );
      const userRepositoryServer = await dependencyContainer.resolve(
        dependencyTokens.USER_REPOSITORY_SERVER,
      );
      const userMapper = await dependencyContainer.resolve(
        dependencyTokens.USER_MAPPER,
      );

      return new SignInUserWithOAuthUseCase(
        authClientServer,
        userRepositoryServer,
        userMapper,
      );
    },
  );

  container.registerFactory(
    tokens.SIGN_IN_USER_WITH_OTP_USE_CASE,
    async (dependencyContainer) => {
      const authClientServer = await dependencyContainer.resolve(
        dependencyTokens.AUTH_CLIENT_SERVER,
      );
      const userMapper = await dependencyContainer.resolve(
        dependencyTokens.USER_MAPPER,
      );

      return new SignInUserWithOtpUseCase(authClientServer, userMapper);
    },
  );

  container.registerFactory(
    tokens.USER_NAME_CHANGE_USE_CASE,
    async (dependencyContainer) => {
      const authClientServer = await dependencyContainer.resolve(
        dependencyTokens.AUTH_CLIENT_SERVER,
      );
      const userRepository = await dependencyContainer.resolve(
        dependencyTokens.USER_REPOSITORY_SERVER,
      );

      return new UserNameChangeUseCase(authClientServer, userRepository);
    },
  );

  container.registerFactory(
    tokens.USER_PASSWORD_CHANGE_USE_CASE,
    async (dependencyContainer) => {
      const authClientServer = await dependencyContainer.resolve(
        dependencyTokens.AUTH_CLIENT_SERVER,
      );
      const userRepository = await dependencyContainer.resolve(
        dependencyTokens.USER_REPOSITORY_SERVER,
      );

      return new UserPasswordChangeUseCase(authClientServer, userRepository);
    },
  );
}
