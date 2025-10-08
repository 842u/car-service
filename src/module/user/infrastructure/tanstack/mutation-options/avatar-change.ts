import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import { userApiClient } from '@/dependencies/api-client/user';
import { browserAuthClient } from '@/dependencies/auth-client/browser';
import { browserStorageClient } from '@/dependencies/storage-client/browser';
import type { UserDto } from '@/user/application/dto/user';
import { queryKeys } from '@/user/infrastructure/tanstack/query/keys';
import { hashFile } from '@/utils/general';

type MutationVariables = {
  image: File | undefined | null;
  imageInputUrl: string | null;
};

export const userAvatarChangeMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationFn: async (variables: MutationVariables) => {
      const { image } = variables;

      if (!image) throw new Error('No file was provided. Try again.');

      const sessionResult = await browserAuthClient.getSession();

      if (!sessionResult.success) {
        const { message } = sessionResult.error;
        throw new Error(message);
      }

      const authIdentity = sessionResult.data;

      const hashedFile = await hashFile(image);

      const uploadPath = `${authIdentity.id}/${hashedFile}`;

      const uploadResult = await browserStorageClient.upload(
        'avatars',
        uploadPath,
        image,
      );

      if (!uploadResult.success) {
        const { message } = uploadResult.error;
        throw new Error(message);
      }

      const avatarPath = uploadResult.data.fullPath;

      const apiUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL! + '/storage/v1/object/public/';

      const avatarUrl = apiUrl + avatarPath;

      const avatarUrlChangeResult = await userApiClient.avatarChange({
        avatarUrl,
      });

      if (!avatarUrlChangeResult.success) {
        const { message } = avatarUrlChangeResult.error;
        throw new Error(message);
      }

      return avatarUrlChangeResult.data;
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.sessionUser,
      });

      const previousQueryData = queryClient.getQueryData(queryKeys.sessionUser);

      queryClient.setQueryData(
        queryKeys.sessionUser,
        (currentQueryData: UserDto) => {
          const updatedQueryData = {
            ...currentQueryData,
            avatarUrl: variables.imageInputUrl,
          };

          return updatedQueryData;
        },
      );

      return { previousQueryData };
    },
  });
