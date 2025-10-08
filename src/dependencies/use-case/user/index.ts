import { adminAuthClient } from '@/dependencies/auth-client/admin';
import { createServerAuthClient } from '@/dependencies/auth-client/server';
import { userMapper } from '@/dependencies/mapper/user';
import { createUserRepository } from '@/dependencies/repository';
import { adminUserRepository } from '@/dependencies/repository/admin';
import { AvatarUrlChangeUseCase } from '@/user/application/use-case/avatar-url-change';
import { NameChangeUseCase } from '@/user/application/use-case/name-change';
import { PasswordChangeUseCase } from '@/user/application/use-case/password-change';
import { SignInWithOAuthUseCase } from '@/user/application/use-case/sign-in-with-o-auth';
import { SignInWithOtpUseCase } from '@/user/application/use-case/sign-in-with-otp';
import { SignUpUseCase } from '@/user/application/use-case/sign-up-user-use-case';

export async function createSignUpUseCase() {
  return new SignUpUseCase(adminAuthClient, adminUserRepository);
}

export async function createSignInWithOAuthUseCase() {
  const authClient = await createServerAuthClient();
  const userRepository = await createUserRepository();
  return new SignInWithOAuthUseCase(authClient, userRepository, userMapper);
}

export async function createSignInWithOtpUseCase() {
  const authClient = await createServerAuthClient();
  return new SignInWithOtpUseCase(authClient, userMapper);
}

export async function createNameChangeUseCase() {
  const authClient = await createServerAuthClient();
  const userRepository = await createUserRepository();
  return new NameChangeUseCase(authClient, userRepository);
}

export async function createPasswordChangeUseCase() {
  const authClient = await createServerAuthClient();
  const userRepository = await createUserRepository();
  return new PasswordChangeUseCase(authClient, userRepository);
}

export async function createAvatarUrlChangeUseCase() {
  const authClient = await createServerAuthClient();
  const userRepository = await createUserRepository();
  return new AvatarUrlChangeUseCase(authClient, userRepository);
}
