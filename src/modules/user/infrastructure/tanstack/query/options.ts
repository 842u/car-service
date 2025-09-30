import { queryOptions } from '@tanstack/react-query';

import { dependencyContainer, dependencyTokens } from '@/di';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';

export const getSessionUserQueryOptions = queryOptions({
  throwOnError: false,
  queryKey: queryKeys.userSession,
  queryFn: async () => {
    const userStore = await dependencyContainer.resolve(
      dependencyTokens.USER_STORE,
    );

    const userResult = await userStore.getSessionUser();

    if (!userResult.success) {
      const { message } = userResult.error;
      throw new Error(message);
    }

    return userResult.data;
  },
});
