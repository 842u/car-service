import { NextApiHandler } from '@/common/infrastructure/api-handler/next-api-handler';
import type { DependencyContainer } from '@/di/container';
import { tokens } from '@/di/tokens';

export function registerApiHandlerModule(container: DependencyContainer) {
  container.registerCached(tokens.API_HANDLER, async (container) => {
    const validator = await container.resolve(tokens.VALIDATOR);
    return new NextApiHandler(validator);
  });

  container.registerCached(
    tokens.SIGN_UP_API_HANDLER,
    async (dependencyContainer) => {
      const validator = await dependencyContainer.resolve(tokens.VALIDATOR);
      return new NextApiHandler(validator);
    },
  );

  container.registerCached(
    tokens.SIGN_IN_API_HANDLER,
    async (dependencyContainer) => {
      const validator = await dependencyContainer.resolve(tokens.VALIDATOR);
      return new NextApiHandler(validator);
    },
  );

  container.registerCached(
    tokens.PASSWORD_CHANGE_API_HANDLER,
    async (dependencyContainer) => {
      const validator = await dependencyContainer.resolve(tokens.VALIDATOR);
      return new NextApiHandler(validator);
    },
  );

  container.registerCached(
    tokens.USER_NAME_CHANGE_API_HANDLER,
    async (dependencyContainer) => {
      const validator = await dependencyContainer.resolve(tokens.VALIDATOR);
      return new NextApiHandler(validator);
    },
  );

  container.registerCached(
    tokens.USER_AVATAR_URL_CHANGE_API_HANDLER,
    async (dependencyContainer) => {
      const validator = await dependencyContainer.resolve(tokens.VALIDATOR);
      return new NextApiHandler(validator);
    },
  );
}
