import { authClientAdmin } from '@/dependencies/auth-client/admin';
import { createAuthClientServer } from '@/dependencies/auth-client/server';
import { userMapper } from '@/dependencies/mapper/user';
import { createUserRepository } from '@/dependencies/repository';
import { userRepositoryAdmin } from '@/dependencies/repository/admin';
import { UserAvatarUrlChangeUseCase } from '@/user/application/use-case/avatar-url-change';
import { UserNameChangeUseCase } from '@/user/application/use-case/name-change';
import { UserPasswordChangeUseCase } from '@/user/application/use-case/password-change';
import { SignInUserWithOAuthUseCase } from '@/user/application/use-case/sign-in-with-o-auth';
import { SignInUserWithOtpUseCase } from '@/user/application/use-case/sign-in-with-otp';
import { SignUpUserUseCase } from '@/user/application/use-case/sign-up-user-use-case';

export async function createSignUpUseCase() {
  return new SignUpUserUseCase(authClientAdmin, userRepositoryAdmin);
}

export async function createSignInWithOAuthUseCase() {
  const authClientServer = await createAuthClientServer();
  const userRepository = await createUserRepository();
  return new SignInUserWithOAuthUseCase(
    authClientServer,
    userRepository,
    userMapper,
  );
}

export async function createSignInWithOtpUseCase() {
  const authClientServer = await createAuthClientServer();
  return new SignInUserWithOtpUseCase(authClientServer, userMapper);
}

export async function createNameChangeUseCase() {
  const authClientServer = await createAuthClientServer();
  const userRepository = await createUserRepository();
  return new UserNameChangeUseCase(authClientServer, userRepository);
}

export async function createPasswordChangeUseCase() {
  const authClientServer = await createAuthClientServer();
  const userRepository = await createUserRepository();
  return new UserPasswordChangeUseCase(authClientServer, userRepository);
}

export async function createAvatarUrlChangeUseCase() {
  const authClientServer = await createAuthClientServer();
  const userRepository = await createUserRepository();
  return new UserAvatarUrlChangeUseCase(authClientServer, userRepository);
}
