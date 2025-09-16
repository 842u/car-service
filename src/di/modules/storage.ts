import { SupabaseStorageClient } from '@/common/infrastructure/storage/supabase-storage-client';
import type { DependencyContainer } from '@/di/container';
import type { SupabaseConfig } from '@/di/modules/supabase';
import { tokens } from '@/di/tokens';

export function registerStorageModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.STORAGE_SERVER_CLIENT,
    async (dependencyContainer, config?: SupabaseConfig) => {
      const supabaseServerClient = await dependencyContainer.resolve(
        tokens.SUPABASE_SERVER_CLIENT,
        config,
      );

      return new SupabaseStorageClient(supabaseServerClient);
    },
  );

  container.registerFactory(
    tokens.STORAGE_BROWSER_CLIENT,
    async (dependencyContainer, config?: SupabaseConfig) => {
      const supabaseBrowserClient = await dependencyContainer.resolve(
        tokens.SUPABASE_BROWSER_CLIENT,
        config,
      );

      return new SupabaseStorageClient(supabaseBrowserClient);
    },
  );
}
