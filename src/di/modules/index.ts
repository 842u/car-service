import type { DependencyContainer } from '@/di/container';
import { registerApiClientModule } from '@/di/modules/api-client';
import { registerApiHandlerModule } from '@/di/modules/api-handler';
import { registerAuthClientModule } from '@/di/modules/auth-client';
import { registerDatabaseClientModule } from '@/di/modules/database-client';
import { registerHttpClientModule } from '@/di/modules/http-client';
import { registerMappersModule } from '@/di/modules/mappers';
import { registerRepositoriesModule } from '@/di/modules/repositories';
import { registerStorageModule } from '@/di/modules/storage';
import { registerStoresModule } from '@/di/modules/stores';
import { registerSupabaseModule } from '@/di/modules/supabase';
import { registerUseCasesModule } from '@/di/modules/use-cases';
import { registerValidatorModule } from '@/di/modules/validator';

export function registerModules(container: DependencyContainer) {
  registerApiClientModule(container);
  registerApiHandlerModule(container);
  registerAuthClientModule(container);
  registerDatabaseClientModule(container);
  registerHttpClientModule(container);
  registerStorageModule(container);
  registerSupabaseModule(container);
  registerValidatorModule(container);
  registerRepositoriesModule(container);
  registerUseCasesModule(container);
  registerMappersModule(container);
  registerStoresModule(container);
}
