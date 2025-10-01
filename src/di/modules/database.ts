import { SupabaseDatabaseClient } from '@/common/infrastructure/database/supabase-database-client';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';

export function registerDatabaseModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.DATABASE_ADMIN_CLIENT,
    async (dependencyContainer, config) => {
      const supabaseAdminClient = await dependencyContainer.resolve(
        tokens.SUPABASE_ADMIN_CLIENT,
        config,
      );

      return new SupabaseDatabaseClient(supabaseAdminClient);
    },
  );

  container.registerFactory(
    tokens.DATABASE_SERVER_CLIENT,
    async (dependencyContainer) => {
      const supabaseServerClient = await dependencyContainer.resolve(
        tokens.SUPABASE_CLIENT_SERVER,
      );

      return new SupabaseDatabaseClient(supabaseServerClient);
    },
  );

  container.registerFactory(
    tokens.DATABASE_BROWSER_CLIENT,
    async (dependencyContainer) => {
      const supabaseBrowserClient = await dependencyContainer.resolve(
        tokens.SUPABASE_CLIENT_BROWSER,
      );

      return new SupabaseDatabaseClient(supabaseBrowserClient);
    },
  );
}
