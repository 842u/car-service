import { z } from 'zod';

import { NextApiHandler } from '@/common/infrastructure/api-handler/next-api-handler';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';
import { userNameChangeContractSchema } from '@/user/interface/contracts/name-change.schema';
import { passwordChangeContractSchema } from '@/user/interface/contracts/password-change.schema';
import { signInContractSchema } from '@/user/interface/contracts/sign-in.schema';
import { signUpContractSchema } from '@/user/interface/contracts/sign-up.schema';

export function registerApiHandlerModule(container: DependencyContainer) {
  container.registerCached(tokens.API_HANDLER, async (container) => {
    const validator = await container.resolveValidator({
      schema: z.unknown(),
    });

    return new NextApiHandler(validator);
  });

  container.registerCached(
    tokens.SIGN_UP_API_HANDLER,
    async (dependencyContainer) => {
      const validator = await dependencyContainer.resolveValidator({
        schema: signUpContractSchema,
        errorMessage: 'Sign up contract validation failed.',
      });

      return new NextApiHandler(validator);
    },
  );

  container.registerCached(
    tokens.SIGN_IN_API_HANDLER,
    async (dependencyContainer) => {
      const validator = await dependencyContainer.resolveValidator({
        schema: signInContractSchema,
        errorMessage: 'Sign in contract validation failed.',
      });

      return new NextApiHandler(validator);
    },
  );

  container.registerCached(
    tokens.PASSWORD_CHANGE_API_HANDLER,
    async (dependencyContainer) => {
      const validator = await dependencyContainer.resolveValidator({
        schema: passwordChangeContractSchema,
        errorMessage: 'Password change contract validation failed.',
      });

      return new NextApiHandler(validator);
    },
  );

  container.registerCached(
    tokens.USER_NAME_CHANGE_API_HANDLER,
    async (dependencyContainer) => {
      const validator = await dependencyContainer.resolveValidator({
        schema: userNameChangeContractSchema,
        errorMessage: 'User name change contract validation failed.',
      });

      return new NextApiHandler(validator);
    },
  );
}
