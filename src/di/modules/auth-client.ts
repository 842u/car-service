import {
  SupabaseAuthAdminClient,
  SupabaseAuthClient,
} from '@/common/infrastructure/auth-client/supabase-auth-client';
import type { DependencyContainer } from '@/di/container';
import type { SupabaseConfig } from '@/di/modules/supabase-client';
import { tokens } from '@/di/tokens';

export function registerAuthClientModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.AUTH_CLIENT_ADMIN,
    async (dependencyContainer, config?: SupabaseConfig) => {
      const supabaseClientAdmin = await dependencyContainer.resolve(
        tokens.SUPABASE_CLIENT_ADMIN,
        config,
      );

      return new SupabaseAuthAdminClient(supabaseClientAdmin);
    },
  );

  container.registerFactory(
    tokens.AUTH_CLIENT_SERVER,
    async (dependencyContainer) => {
      const supabaseClientServer = await dependencyContainer.resolve(
        tokens.SUPABASE_CLIENT_SERVER,
      );

      return new SupabaseAuthClient(supabaseClientServer);
    },
  );

  container.registerFactory(
    tokens.AUTH_CLIENT_BROWSER,
    async (dependencyContainer) => {
      const supabaseClientBrowser = await dependencyContainer.resolve(
        tokens.SUPABASE_CLIENT_BROWSER,
      );

      return new SupabaseAuthClient(supabaseClientBrowser);
    },
  );
}
