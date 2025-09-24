import { SupabaseDatabaseClient } from '@/common/infrastructure/database/supabase-database-client';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';

export function registerDatabaseModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.DATABASE_SERVER_CLIENT,
    async (dependencyContainer, config) => {
      const supabaseServerClient = await dependencyContainer.resolve(
        tokens.SUPABASE_SERVER_CLIENT,
        config,
      );

      return new SupabaseDatabaseClient(supabaseServerClient);
    },
  );

  container.registerFactory(
    tokens.DATABASE_BROWSER_CLIENT,
    async (dependencyContainer, config) => {
      const supabaseBrowserClient = await dependencyContainer.resolve(
        tokens.SUPABASE_BROWSER_CLIENT,
        config,
      );

      return new SupabaseDatabaseClient(supabaseBrowserClient);
    },
  );
}
