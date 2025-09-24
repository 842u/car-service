import type { DependencyContainer } from '@/di/container';
import { registerApiClientModule } from '@/di/modules/api-client';
import { registerApiHandlerModule } from '@/di/modules/api-handler';
import { registerAuthModule } from '@/di/modules/auth';
import { registerDatabaseModule } from '@/di/modules/database';
import { registerHttpModule } from '@/di/modules/http';
import { registerMappersModule } from '@/di/modules/mappers';
import { registerRepositoriesModule } from '@/di/modules/repositories';
import { registerStorageModule } from '@/di/modules/storage';
import { registerSupabaseModule } from '@/di/modules/supabase';
import { registerUseCasesModule } from '@/di/modules/use-cases';
import { registerValidatorModule } from '@/di/modules/validator';

export function registerModules(container: DependencyContainer) {
  registerApiClientModule(container);
  registerApiHandlerModule(container);
  registerAuthModule(container);
  registerDatabaseModule(container);
  registerHttpModule(container);
  registerStorageModule(container);
  registerSupabaseModule(container);
  registerValidatorModule(container);
  registerRepositoriesModule(container);
  registerUseCasesModule(container);
  registerMappersModule(container);
}
