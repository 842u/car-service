import type {
  EmailOtpType,
  Provider,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import type { Database } from 'supabase/types/supabase';

import type {
  AuthAdminClient,
  AuthClient,
} from '@/common/application/auth-client/auth-client.interface';
import { Result } from '@/common/application/result/result';

export class SupabaseAuthClient implements AuthClient<User> {
  protected readonly _authClient: SupabaseClient<Database>['auth'];

  constructor(client: SupabaseClient) {
    this._authClient = client.auth;
  }

  async getSession() {
    try {
      const { data, error } = await this._authClient.getUser();

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(data.user);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }

  async signIn(contract: { email: string; password: string }) {
    try {
      const { data, error } =
        await this._authClient.signInWithPassword(contract);

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(data.user);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }

  async signOut() {
    try {
      const { error } = await this._authClient.signOut();

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(null);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }

  async signUp(
    contract: { email: string; password: string },
    options?: {
      emailRedirectTo?: string;
    },
  ) {
    try {
      const { data, error } = await this._authClient.signUp({
        ...contract,
        options,
      });

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(data.user!);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }

  async resetPassword({
    email,
    options,
  }: {
    email: string;
    options?: {
      redirectTo?: string;
    };
  }) {
    try {
      const { error } = await this._authClient.resetPasswordForEmail(
        email,
        options,
      );

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(null);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }

  async updateUser({
    attributes,
    options,
  }: {
    attributes: { password: string };
    options?: {
      emailRedirectTo?: string;
    };
  }) {
    try {
      const { data, error } = await this._authClient.updateUser(
        attributes,
        options,
      );

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(data.user);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }

  async verifyOtp(contract: { type: EmailOtpType; token_hash: string }) {
    try {
      const { data, error } = await this._authClient.verifyOtp(contract);

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(data.user!);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }

  async exchangeCodeForSession(code: string) {
    try {
      const { data, error } =
        await this._authClient.exchangeCodeForSession(code);

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(data.user);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }

  async signInWithOAuth(contract: {
    provider: Provider;
    options: { redirectTo: string };
  }) {
    try {
      const { error } = await this._authClient.signInWithOAuth(contract);

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(null);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }

  async sendConfirmationEmail(contract: { email: string; redirectTo: string }) {
    try {
      const { email, redirectTo } = contract;
      const { error } = await this._authClient.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(null);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }
}

export class SupabaseAuthAdminClient
  extends SupabaseAuthClient
  implements AuthAdminClient<User>
{
  constructor(client: SupabaseClient) {
    super(client);
  }

  async createUser(contract: {
    email: string;
    password: string;
    email_confirm: boolean;
  }) {
    try {
      const { data, error } = await this._authClient.admin.createUser(contract);

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(data.user);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error
            ? error.message
            : 'Unknown auth admin client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }

  async deleteUser(contract: { id: string }) {
    try {
      const { id } = contract;
      const { data, error } = await this._authClient.admin.deleteUser(id);

      if (error) {
        const { message, code, status } = error;
        const parsedCode = String(code);
        return Result.fail({ message, code: parsedCode, status });
      }

      return Result.ok(data.user);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error
            ? error.message
            : 'Unknown auth admin client error.',
        code: 'unknown_error',
        status: 500,
      });
    }
  }
}
