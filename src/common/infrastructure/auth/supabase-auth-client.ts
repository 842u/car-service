import type {
  EmailOtpType,
  Provider,
  SupabaseClient,
} from '@supabase/supabase-js';

import type {
  AuthAdminClient,
  AuthClient,
} from '@/common/application/auth/auth-client.interface';
import { Result } from '@/common/interface/result/result';
import type { Database } from '@/types/supabase';
import type { SignInContract } from '@/user/interface/contracts/sign-in.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

export class SupabaseAuthClient implements AuthClient {
  private readonly _authClient: SupabaseClient<Database>['auth'];
  private readonly _authAdminClient: AuthAdminClient;

  constructor(client: SupabaseClient) {
    this._authClient = client.auth;
    this._authAdminClient = new SupabaseAuthAdminClient(client);
  }

  async getSession() {
    try {
      const { data, error } = await this._authClient.getUser();

      if (error) return Result.fail({ message: error.message });

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
      });
    }
  }

  async signIn(contract: SignInContract) {
    try {
      const { data, error } =
        await this._authClient.signInWithPassword(contract);

      if (error) return Result.fail({ message: error.message });

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
      });
    }
  }

  async signOut() {
    try {
      const { error } = await this._authClient.signOut();

      if (error) return Result.fail({ message: error.message });

      return Result.ok({});
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
      });
    }
  }

  async signUp(
    contract: SignUpContract,
    options?: {
      emailRedirectTo?: string;
    },
  ) {
    try {
      const { data, error } = await this._authClient.signUp({
        ...contract,
        options,
      });

      if (error) return Result.fail({ message: error.message });

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
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
      const { data, error } = await this._authClient.resetPasswordForEmail(
        email,
        options,
      );

      if (error) return Result.fail({ message: error.message });

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
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

      if (error) return Result.fail({ message: error.message });

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
      });
    }
  }

  async verifyOtp(contract: { type: EmailOtpType; token_hash: string }) {
    try {
      const { data, error } = await this._authClient.verifyOtp(contract);

      if (error) return Result.fail({ message: error.message });

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
      });
    }
  }

  async exchangeCodeForSession(code: string) {
    try {
      const { data, error } =
        await this._authClient.exchangeCodeForSession(code);

      if (error) return Result.fail({ message: error.message });

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
      });
    }
  }

  async signInWithOAuth(contract: {
    provider: Provider;
    options: { redirectTo: string };
  }) {
    try {
      const { data, error } = await this._authClient.signInWithOAuth(contract);

      if (error) return Result.fail({ message: error.message });

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error ? error.message : 'Unknown auth client error.',
      });
    }
  }

  get admin() {
    return this._authAdminClient;
  }
}

class SupabaseAuthAdminClient implements AuthAdminClient {
  private readonly _authAdminClient: SupabaseClient<Database>['auth']['admin'];

  constructor(client: SupabaseClient) {
    this._authAdminClient = client.auth.admin;
  }

  async createUser(contract: {
    email: string;
    password: string;
    email_confirm: boolean;
  }) {
    try {
      const { data, error } = await this._authAdminClient.createUser(contract);

      if (error) return Result.fail({ message: error.message });

      return Result.ok(data);
    } catch (error) {
      return Result.fail({
        message:
          error instanceof Error
            ? error.message
            : 'Unknown auth admin client error.',
      });
    }
  }
}
