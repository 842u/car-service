import { SupabaseDatabaseClient } from '@/common/infrastructure/database-client/supabase-database-client';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';

export function registerDatabaseClientModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.DATABASE_CLIENT_ADMIN,
    async (dependencyContainer, config) => {
      const supabaseClientAdmin = await dependencyContainer.resolve(
        tokens.SUPABASE_CLIENT_ADMIN,
        config,
      );

      return new SupabaseDatabaseClient(supabaseClientAdmin);
    },
  );

  container.registerFactory(
    tokens.DATABASE_CLIENT_SERVER,
    async (dependencyContainer) => {
      const supabaseClientServer = await dependencyContainer.resolve(
        tokens.SUPABASE_CLIENT_SERVER,
      );

      return new SupabaseDatabaseClient(supabaseClientServer);
    },
  );

  container.registerFactory(
    tokens.DATABASE_CLIENT_BROWSER,
    async (dependencyContainer) => {
      const supabaseClientBrowser = await dependencyContainer.resolve(
        tokens.SUPABASE_CLIENT_BROWSER,
      );

      return new SupabaseDatabaseClient(supabaseClientBrowser);
    },
  );
}
