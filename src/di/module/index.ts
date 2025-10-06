import type { DependencyContainer } from '@/di/container';
import { registerApiClientModule } from '@/di/module/api-client';
import { registerApiHandlerModule } from '@/di/module/api-handler';
import { registerAuthClientModule } from '@/di/module/auth-client';
import { registerDataSourceModule } from '@/di/module/data-source';
import { registerDatabaseClientModule } from '@/di/module/database-client';
import { registerHttpClientModule } from '@/di/module/http-client';
import { registerMapperModule } from '@/di/module/mapper';
import { registerRepositoryModule } from '@/di/module/repository';
import { registerStorageClientModule } from '@/di/module/storage-client';
import { registerSupabaseClientModule } from '@/di/module/supabase-client';
import { registerUseCaseModule } from '@/di/module/use-case';
import { registerValidatorModule } from '@/di/module/validator';

export function registerModules(container: DependencyContainer) {
  registerApiClientModule(container);
  registerApiHandlerModule(container);
  registerAuthClientModule(container);
  registerDatabaseClientModule(container);
  registerHttpClientModule(container);
  registerStorageClientModule(container);
  registerSupabaseClientModule(container);
  registerValidatorModule(container);
  registerRepositoryModule(container);
  registerUseCaseModule(container);
  registerMapperModule(container);
  registerDataSourceModule(container);
}
