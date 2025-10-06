import type { DependencyContainer } from '@/di/container';
import { registerApiClientModule } from '@/di/modules/api-client';
import { registerApiHandlerModule } from '@/di/modules/api-handler';
import { registerAuthClientModule } from '@/di/modules/auth-client';
import { registerDataSourceModule } from '@/di/modules/data-source';
import { registerDatabaseClientModule } from '@/di/modules/database-client';
import { registerHttpClientModule } from '@/di/modules/http-client';
import { registerMapperModule } from '@/di/modules/mapper';
import { registerRepositoryModule } from '@/di/modules/repository';
import { registerStorageClientModule } from '@/di/modules/storage-client';
import { registerSupabaseClientModule } from '@/di/modules/supabase-client';
import { registerUseCaseModule } from '@/di/modules/use-case';
import { registerValidatorModule } from '@/di/modules/validator';

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
