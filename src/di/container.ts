/* eslint @typescript-eslint/no-explicit-any:0 */

import type { z } from 'zod';

import type { ZodValidator } from '@/common/infrastructure/validation/zod-validator';
import { type DependencyToken, tokens } from '@/di/tokens';

export interface ValidatorConfig<T extends z.ZodSchema<any>> {
  schema: T;
  errorMessage?: string;
}

export class DependencyContainer {
  private instances = new Map<DependencyToken<any>, any>();
  private factories = new Map<
    DependencyToken<any, any>,
    (container: DependencyContainer, params?: any) => any
  >();

  registerFactory<T, P = void>(
    token: DependencyToken<T, P>,
    factory: (container: DependencyContainer, params?: P) => T | Promise<T>,
  ) {
    this.factories.set(token, factory);
  }

  registerCached<T, P = void>(
    token: DependencyToken<T, P>,
    factory: (container: DependencyContainer, params?: P) => T | Promise<T>,
  ) {
    this.factories.set(token, async (container) => {
      if (!this.instances.has(token)) {
        const instance = await factory(container);
        this.instances.set(token, instance);
      }

      return this.instances.get(token);
    });
  }

  async resolve<T, P = void>(
    token: DependencyToken<T, P>,
    params?: P,
  ): Promise<T> {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const factory = this.factories.get(token);

    if (!factory) {
      throw new Error(`Dependency not found: ${String(token.name)}.`);
    }

    return await factory(this, params);
  }

  async resolveValidator<TSchema extends z.ZodSchema<any>>(
    config: ValidatorConfig<TSchema>,
  ): Promise<ZodValidator<z.infer<TSchema>>> {
    const factory = this.factories.get(tokens.VALIDATOR);

    if (!factory) {
      throw new Error('Validator factory not registered');
    }

    return await factory(this, config);
  }
}
