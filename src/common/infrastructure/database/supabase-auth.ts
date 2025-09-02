import type {
  EmailOtpType,
  Provider,
  SupabaseClient,
} from '@supabase/supabase-js';

import type {
  DatabaseAuth,
  DatabaseAuthAdmin,
} from '@/common/application/database/database-auth.interface';
import { Result } from '@/common/interface/result/result';
import type { SignInContract } from '@/user/interface/contracts/sign-in.schema';
import type { SignUpContract } from '@/user/interface/contracts/sign-up.schema';

export class SupabaseAuth implements DatabaseAuth {
  private readonly _client: SupabaseClient;

  private readonly _admin: DatabaseAuthAdmin;

  constructor(client: SupabaseClient) {
    this._client = client;
    this._admin = new SupabaseDatabaseAuthAdmin(client);
  }

  async getUser() {
    const { data, error } = await this._client.auth.getUser();
    return error ? Result.fail({ message: error.message }) : Result.ok(data);
  }

  async signIn(contract: SignInContract) {
    const { data, error } =
      await this._client.auth.signInWithPassword(contract);
    return error ? Result.fail({ message: error.message }) : Result.ok(data);
  }

  async signOut() {
    const { error } = await this._client.auth.signOut();
    return error ? Result.fail({ message: error.message }) : Result.ok(null);
  }

  async signUp(contract: SignUpContract) {
    const { data, error } = await this._client.auth.signUp(contract);
    return error ? Result.fail({ message: error.message }) : Result.ok(data);
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
    const { error } = await this._client.auth.resetPasswordForEmail(
      email,
      options,
    );
    return error ? Result.fail({ message: error.message }) : Result.ok(null);
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
    const { data, error } = await this._client.auth.updateUser(
      attributes,
      options,
    );
    return error ? Result.fail({ message: error.message }) : Result.ok(data);
  }

  async verifyOtp(contract: { type: EmailOtpType; token_hash: string }) {
    const { data, error } = await this._client.auth.verifyOtp(contract);
    return error ? Result.fail({ message: error.message }) : Result.ok(data);
  }

  async exchangeCodeForSession(code: string) {
    const { data, error } =
      await this._client.auth.exchangeCodeForSession(code);
    return error ? Result.fail({ message: error.message }) : Result.ok(data);
  }

  async signInWithOAuth(contract: {
    provider: Provider;
    options: { redirectTo: string };
  }) {
    const { data, error } = await this._client.auth.signInWithOAuth(contract);
    return error ? Result.fail({ message: error.message }) : Result.ok(data);
  }

  get admin() {
    return this._admin;
  }
}

class SupabaseDatabaseAuthAdmin implements DatabaseAuthAdmin {
  private readonly _supabaseClient: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this._supabaseClient = supabaseClient;
  }

  async createUser(contract: {
    email: string;
    password: string;
    email_confirm: boolean;
  }) {
    const { data, error } =
      await this._supabaseClient.auth.admin.createUser(contract);
    return error ? Result.fail({ message: error.message }) : Result.ok(data);
  }
}
