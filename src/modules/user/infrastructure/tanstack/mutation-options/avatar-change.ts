import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import { dependencyContainer, dependencyTokens } from '@/di';
import type { UserDto } from '@/user/application/dto/user-dto';
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

      const authClient = await dependencyContainer.resolve(
        dependencyTokens.AUTH_CLIENT_BROWSER,
      );

      const sessionResult = await authClient.getSession();

      if (!sessionResult.success) {
        const { message } = sessionResult.error;
        throw new Error(message);
      }

      const authIdentity = sessionResult.data;

      const storageClient = await dependencyContainer.resolve(
        dependencyTokens.STORAGE_CLIENT_BROWSER,
      );

      const hashedFile = await hashFile(image);

      const uploadPath = `${authIdentity.id}/${hashedFile}`;

      const uploadResult = await storageClient.upload(
        'avatars',
        uploadPath,
        image,
      );

      if (!uploadResult.success) {
        const { message } = uploadResult.error;
        throw new Error(message);
      }

      const avatarPath = uploadResult.data.fullPath;

      const userApiClient = await dependencyContainer.resolve(
        dependencyTokens.USER_API_CLIENT,
      );

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
