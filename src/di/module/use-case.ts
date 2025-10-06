import { dependencyTokens } from '@/di';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { UserAvatarUrlChangeUseCase } from '@/user/application/use-case/avatar-url-change';
import { UserNameChangeUseCase } from '@/user/application/use-case/name-change';
import { UserPasswordChangeUseCase } from '@/user/application/use-case/password-change';
import { SignInUserWithOAuthUseCase } from '@/user/application/use-case/sign-in-with-o-auth';
import { SignInUserWithOtpUseCase } from '@/user/application/use-case/sign-in-with-otp';
import { SignUpUserUseCase } from '@/user/application/use-case/sign-up-user-use-case';

export function registerUseCaseModule(container: DependencyContainer) {
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

  container.registerFactory(
    tokens.USER_AVATAR_URL_CHANGE_USE_CASE,
    async (dependencyContainer) => {
      const authClientServer = await dependencyContainer.resolve(
        dependencyTokens.AUTH_CLIENT_SERVER,
      );
      const userRepository = await dependencyContainer.resolve(
        dependencyTokens.USER_REPOSITORY_SERVER,
      );

      return new UserAvatarUrlChangeUseCase(authClientServer, userRepository);
    },
  );
}
