import { queryOptions } from '@tanstack/react-query';

import { userDataSource } from '@/dependencies/data-source/user';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';

export const getSessionUserQueryOptions = queryOptions({
  throwOnError: false,
  queryKey: queryKeys.sessionUser,
  queryFn: async () => {
    const userResult = await userDataSource.getSessionUser();

    if (!userResult.success) {
      const { message } = userResult.error;
      throw new Error(message);
    }

    return userResult.data;
  },
});
