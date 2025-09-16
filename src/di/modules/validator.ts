/* eslint @typescript-eslint/no-explicit-any:0 */

import { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import type { DependencyContainer, ValidatorConfig } from '@/di/container';
import { tokens } from '@/di/tokens';

export function registerValidatorModule(container: DependencyContainer) {
  container.registerFactory(
    tokens.VALIDATOR,
    (_, config?: ValidatorConfig<any>) => {
      if (!config) {
        throw new Error('Validator configuration is required');
      }
      return new ZodValidator(config.schema, config.errorMessage);
    },
  );
}
