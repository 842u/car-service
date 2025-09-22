import type { Route } from 'next';

import { Result } from '@/common/application/result/result';
import type { UseCase } from '@/common/application/use-case/use-case.interface';
import type { SupabaseAuthClient } from '@/common/infrastructure/auth/supabase-auth-client';
import { User } from '@/user/domain/user/user';
import { Credentials } from '@/user/domain/user/value-objects/credentials';
import type { UserRepository } from '@/user/infrastructure/repositories/user-repository';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

type SignUpUseCaseError = { code: number };

export class SignUpUserUseCase
  implements UseCase<SignUpContract, SignUpUseCaseError>
{
  private readonly _authClient: SupabaseAuthClient;
  private readonly _authAdminClient: SupabaseAuthClient;
  private readonly _userRepository: UserRepository;

  constructor(
    authClient: SupabaseAuthClient,
    authAdminClient: SupabaseAuthClient,
    userRepository: UserRepository,
  ) {
    this._authClient = authClient;
    this._authAdminClient = authAdminClient;
    this._userRepository = userRepository;
  }

  async execute(contract: SignUpContract) {
    const { email: emailDto, password: passwordDto } = contract;
    const credentialsResult = Credentials.create(emailDto, passwordDto);

    if (!credentialsResult.success) {
      const { message } = credentialsResult.error;
      return Result.fail({ message, code: 422 });
    }

    const {
      email: { value: email },
      password: { value: password },
    } = credentialsResult.data;
    const signUpRedirectPath = '/dashboard' satisfies Route;
    const signUpResult = await this._authClient.signUp(
      { email, password },
      { emailRedirectTo: signUpRedirectPath },
    );

    if (!signUpResult.success) {
      const { message } = signUpResult.error;
      return Result.fail({ message, code: 500 });
    }

    const { user } = signUpResult.data;

    if (!user) {
      return Result.fail({
        message: 'Cannot get authentication identity.',
        code: 500,
      });
    }

    if (!user.identities?.length) {
      /*
       * If email confirmation and phone confirmation are enabled, signUp() will return an obfuscated user for confirmed existing user.
       * For users who forget that have and account send email with password reset flow.
       */
      const resetPasswordResult = await this._authClient.resetPassword({
        email,
        options: {
          redirectTo: signUpRedirectPath,
        },
      });

      if (!resetPasswordResult.success) {
        const { message } = resetPasswordResult.error;
        return Result.fail({ message, code: 500 });
      }

      const userResult = User.create({
        id: user.id,
        email: user.email!,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.first_name ||
          user.email ||
          user.id,
        avatarUrl: user.user_metadata?.avatar_url,
      });

      if (!userResult.success) {
        const { message } = userResult.error;
        return Result.fail({ message, code: 422 });
      }

      return Result.ok(userResult.data);
    }

    const userResult = User.create({
      id: user.id,
      email: user.email!,
      name:
        user.user_metadata?.full_name ||
        user.user_metadata?.first_name ||
        user.email ||
        user.id,
      avatarUrl: user.user_metadata?.avatar_url,
    });

    if (!userResult.success) {
      await this._authAdminClient.admin.deleteUser({
        id: user.id,
      });
      const { message } = userResult.error;
      return Result.fail({ message, code: 422 });
    }

    const storeUserResult = await this._userRepository.store(userResult.data);

    if (!storeUserResult.success) {
      await this._authAdminClient.admin.deleteUser({
        id: user.id,
      });
      const { message, code } = storeUserResult.error;
      const parsedCode = code && parseInt(code);
      return Result.fail({
        message,
        code: parsedCode || 500,
      });
    }

    return Result.ok(userResult.data);
  }
}
