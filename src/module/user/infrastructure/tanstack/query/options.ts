import { queryOptions } from '@tanstack/react-query';

import { dependencyContainer, dependencyTokens } from '@/di';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';

export const getSessionUserQueryOptions = queryOptions({
  throwOnError: false,
  queryKey: queryKeys.sessionUser,
  queryFn: async () => {
    const userStore = await dependencyContainer.resolve(
      dependencyTokens.USER_DATA_SOURCE,
    );

    const userResult = await userStore.getSessionUser();

    if (!userResult.success) {
      const { message } = userResult.error;
      throw new Error(message);
    }

    return userResult.data;
  },
});
