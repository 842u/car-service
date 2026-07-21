import { adminAuthClient } from '@/dependency/auth-client/admin';
import { createServerAuthClient } from '@/dependency/auth-client/server';
import { AvatarUrlChangeUseCase } from '@/user/application/use-case/avatar-url-change';
import { NameChangeUseCase } from '@/user/application/use-case/name-change';
import { PasswordChangeUseCase } from '@/user/application/use-case/password-change';
import { SignInUseCase } from '@/user/application/use-case/sign-in';
import { SignInWithOAuthUseCase } from '@/user/application/use-case/sign-in-with-o-auth';
import { SignInWithOtpUseCase } from '@/user/application/use-case/sign-in-with-otp';
import { SignUpUseCase } from '@/user/application/use-case/sign-up';
import { userMapper } from '@/user/dependency/mapper';
import { userRepository } from '@/user/dependency/repository';

export async function createSignUpUseCase(origin: string) {
  return new SignUpUseCase(adminAuthClient, userRepository, userMapper, origin);
}

export async function createSignInUseCase() {
  const authClient = await createServerAuthClient();
  return new SignInUseCase(authClient, userRepository, userMapper);
}

export async function createSignInWithOAuthUseCase() {
  const authClient = await createServerAuthClient();
  return new SignInWithOAuthUseCase(authClient, userRepository, userMapper);
}

export async function createSignInWithOtpUseCase() {
  const authClient = await createServerAuthClient();
  return new SignInWithOtpUseCase(authClient, userMapper);
}

export async function createNameChangeUseCase() {
  const authClient = await createServerAuthClient();
  return new NameChangeUseCase(authClient, userRepository, userMapper);
}

export async function createPasswordChangeUseCase() {
  const authClient = await createServerAuthClient();
  return new PasswordChangeUseCase(authClient, userRepository, userMapper);
}

export async function createAvatarUrlChangeUseCase() {
  const authClient = await createServerAuthClient();
  return new AvatarUrlChangeUseCase(authClient, userRepository, userMapper);
}
