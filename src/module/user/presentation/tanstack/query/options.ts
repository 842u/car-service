import { queryOptions } from '@tanstack/react-query';

import { userDataSource } from '@/user/dependency/data-source';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

export const getSessionUserQueryOptions = queryOptions({
  queryKey: queryKeys.session(),
  queryFn: async () => {
    const userResult = await userDataSource.getSessionUser();

    if (!userResult.success) {
      const { message } = userResult.error;
      throw new Error(message);
    }

    return userResult.data;
  },
});

export const getUserByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: queryKeys.byId(id),
    queryFn: async () => {
      const userResult = await userDataSource.getById(id);

      if (!userResult.success) {
        const { message } = userResult.error;
        throw new Error(message);
      }

      return userResult.data;
    },
  });
