import {
  SupabaseAuthAdminClient,
  SupabaseAuthClient,
} from '@/common/infrastructure/auth/supabase-auth-client';
import type { DependencyContainer } from '@/di/container';
import type { SupabaseConfig } from '@/di/modules/supabase';
import { tokens } from '@/di/tokens';

export function registerAuthModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.AUTH_ADMIN_CLIENT,
    async (dependencyContainer, config?: SupabaseConfig) => {
      const supabaseAdminClient = await dependencyContainer.resolve(
        tokens.SUPABASE_ADMIN_CLIENT,
        config,
      );

      return new SupabaseAuthAdminClient(supabaseAdminClient);
    },
  );

  container.registerFactory(
    tokens.AUTH_SERVER_CLIENT,
    async (dependencyContainer, config?: SupabaseConfig) => {
      const supabaseServerClient = await dependencyContainer.resolve(
        tokens.SUPABASE_SERVER_CLIENT,
        config,
      );

      return new SupabaseAuthClient(supabaseServerClient);
    },
  );

  container.registerFactory(
    tokens.AUTH_BROWSER_CLIENT,
    async (dependencyContainer, config?: SupabaseConfig) => {
      const supabaseBrowserClient = await dependencyContainer.resolve(
        tokens.SUPABASE_BROWSER_CLIENT,
        config,
      );

      return new SupabaseAuthClient(supabaseBrowserClient);
    },
  );
}
