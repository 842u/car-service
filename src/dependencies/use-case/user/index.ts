import { authClientAdmin } from '@/dependencies/auth-client/admin';
import { createAuthClientServer } from '@/dependencies/auth-client/server';
import { userMapper } from '@/dependencies/mapper/user';
import { createUserRepository } from '@/dependencies/repository';
import { userRepositoryAdmin } from '@/dependencies/repository/admin';
import { AvatarUrlChangeUseCase } from '@/user/application/use-case/avatar-url-change';
import { NameChangeUseCase } from '@/user/application/use-case/name-change';
import { PasswordChangeUseCase } from '@/user/application/use-case/password-change';
import { SignInWithOAuthUseCase } from '@/user/application/use-case/sign-in-with-o-auth';
import { SignInWithOtpUseCase } from '@/user/application/use-case/sign-in-with-otp';
import { SignUpUseCase } from '@/user/application/use-case/sign-up-user-use-case';

export async function createSignUpUseCase() {
  return new SignUpUseCase(authClientAdmin, userRepositoryAdmin);
}

export async function createSignInWithOAuthUseCase() {
  const authClientServer = await createAuthClientServer();
  const userRepository = await createUserRepository();
  return new SignInWithOAuthUseCase(
    authClientServer,
    userRepository,
    userMapper,
  );
}

export async function createSignInWithOtpUseCase() {
  const authClientServer = await createAuthClientServer();
  return new SignInWithOtpUseCase(authClientServer, userMapper);
}

export async function createNameChangeUseCase() {
  const authClientServer = await createAuthClientServer();
  const userRepository = await createUserRepository();
  return new NameChangeUseCase(authClientServer, userRepository);
}

export async function createPasswordChangeUseCase() {
  const authClientServer = await createAuthClientServer();
  const userRepository = await createUserRepository();
  return new PasswordChangeUseCase(authClientServer, userRepository);
}

export async function createAvatarUrlChangeUseCase() {
  const authClientServer = await createAuthClientServer();
  const userRepository = await createUserRepository();
  return new AvatarUrlChangeUseCase(authClientServer, userRepository);
}
