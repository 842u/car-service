import { mutationOptions } from '@tanstack/react-query';

import { browserStorageClient } from '@/dependency/storage-client/browser';
import { hashFile } from '@/lib/utils';
import type { UserDto } from '@/user/application/dto/user';
import { userApiClient } from '@/user/dependency/api-client';
import { queryKeys } from '@/user/presentation/tanstack/query/keys';

type MutationVariables = {
  image: File | undefined | null;
};

export const userAvatarEditMutationOptions = mutationOptions({
  mutationFn: async (variables: MutationVariables, context) => {
    const { image } = variables;

    if (!image) throw new Error('No file was provided. Try again.');

    const sessionUser = context.client.getQueryData<UserDto>(
      queryKeys.session(),
    );

    if (!sessionUser) {
      throw new Error('You must be signed in to change your avatar.');
    }

    const hashedFile = await hashFile(image);

    const uploadPath = `${sessionUser.id}/${hashedFile}`;

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

    const editResult = await userApiClient.edit({ avatarUrl });

    if (!editResult.success) {
      const { message } = editResult.error;
      throw new Error(message);
    }

    return editResult.data;
  },
  onMutate: async (variables, context) => {
    await context.client.cancelQueries({
      queryKey: queryKeys.session(),
    });

    const previousQueryData = context.client.getQueryData<UserDto>(
      queryKeys.session(),
    );

    const optimisticImageUrl = variables.image
      ? URL.createObjectURL(variables.image)
      : undefined;

    context.client.setQueryData(
      queryKeys.session(),
      (current: UserDto | undefined) =>
        current && { ...current, avatarUrl: optimisticImageUrl },
    );

    return { previousQueryData, optimisticImageUrl };
  },
  onError: (_error, _variables, onMutateResult, context) => {
    if (!onMutateResult) return;

    context.client.setQueryData(
      queryKeys.session(),
      onMutateResult.previousQueryData,
    );
  },
  onSettled: (_data, _error, _variables, onMutateResult, context) => {
    if (onMutateResult?.optimisticImageUrl) {
      URL.revokeObjectURL(onMutateResult.optimisticImageUrl);
    }

    context.client.invalidateQueries({
      queryKey: queryKeys.session(),
    });
  },
});
