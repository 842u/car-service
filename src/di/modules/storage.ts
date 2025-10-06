import { SupabaseStorageClient } from '@/common/infrastructure/storage-client/supabase-storage-client';
import type { DependencyContainer } from '@/di/container';
import type { SupabaseConfig } from '@/di/modules/supabase';
import { tokens } from '@/di/tokens';

export function registerStorageModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.STORAGE_CLIENT_ADMIN,
    async (dependencyContainer, config?: SupabaseConfig) => {
      const supabaseClientAdmin = await dependencyContainer.resolve(
        tokens.SUPABASE_ADMIN_CLIENT,
        config,
      );

      return new SupabaseStorageClient(supabaseClientAdmin);
    },
  );

  container.registerFactory(
    tokens.STORAGE_CLIENT_SERVER,
    async (dependencyContainer) => {
      const supabaseClientServer = await dependencyContainer.resolve(
        tokens.SUPABASE_CLIENT_SERVER,
      );

      return new SupabaseStorageClient(supabaseClientServer);
    },
  );

  container.registerFactory(
    tokens.STORAGE_CLIENT_BROWSER,
    async (dependencyContainer) => {
      const supabaseClientBrowser = await dependencyContainer.resolve(
        tokens.SUPABASE_CLIENT_BROWSER,
      );

      return new SupabaseStorageClient(supabaseClientBrowser);
    },
  );
}
