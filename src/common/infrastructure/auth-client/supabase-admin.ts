import type { SupabaseClient } from '@supabase/supabase-js';

import type { AdminAuthClient } from '@/common/application/auth-client';
import { Result } from '@/common/application/result';
import { SupabaseAuthClient } from '@/common/infrastructure/auth-client/supabase';

export class SupabaseAdminAuthClient
  extends SupabaseAuthClient
  implements AdminAuthClient
{
  constructor(client: SupabaseClient) {
    super(client);
  }

  async createAuthIdentity(contract: {
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

  async deleteAuthIdentity(contract: { id: string }) {
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
