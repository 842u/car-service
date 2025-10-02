import { ZodValidator } from '@/common/infrastructure/validator/zod-validator';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';

export function registerValidatorModule(container: DependencyContainer) {
  container.registerFactory(tokens.VALIDATOR, () => {
    return new ZodValidator();
  });
}
