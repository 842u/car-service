import { zodResolver } from '@hookform/resolvers/zod';
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/hooks/use-toasts';
import {
  avatarFormSchema,
  AvatarFormValues,
} from '@/schemas/zod/avatarFormSchema';
import { enqueueRevokeObjectUrl } from '@/utils/general';
import { updateCurrentSessionProfile } from '@/utils/supabase/tables/profiles';
import { queryKeys } from '@/utils/tanstack/keys';
import { profilesUpdateOnMutate } from '@/utils/tanstack/profiles';

export const defaultAvatarFormValues: AvatarFormValues = {
  image: null,
};

type MutationVariables = {
  formData: AvatarFormValues;
  queryClient: QueryClient;
  imageInputUrl: string | null;
};

export function useAvatarForm() {
  const [imageInputUrl, setImageInputUrl] = useState<string | null>(null);

  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData: { image } }: MutationVariables) =>
      updateCurrentSessionProfile({
        property: 'avatar_url',
        value: image,
      }),
    onMutate: ({ queryClient, imageInputUrl }) =>
      profilesUpdateOnMutate(
        queryClient,
        'session',
        'avatar_url',
        imageInputUrl,
      ),
    onSuccess: () => {
      addToast('Avatar uploaded successfully.', 'success');
    },
    onError: (error, { queryClient }, context) => {
      addToast(error.message, 'error');

      queryClient.setQueryData(
        queryKeys.profilesCurrentSession,
        context?.previousQueryData,
      );
    },
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting, isSubmitSuccessful },
  } = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarFormSchema),
    mode: 'onChange',
    defaultValues: defaultAvatarFormValues,
  });

  const handleFormSubmit = handleSubmit(async (formData: AvatarFormValues) => {
    await mutateAsync(
      { formData, queryClient, imageInputUrl },
      {
        onSettled: (_, __, { queryClient }) => {
          queryClient.invalidateQueries({
            queryKey: queryKeys.profilesCurrentSession,
          });
        },
      },
    );
  });

  const handleImageInputChange = (file: File | undefined | null) => {
    imageInputUrl && enqueueRevokeObjectUrl(imageInputUrl);
    setImageInputUrl((file && URL.createObjectURL(file)) || null);
  };

  const handleFormReset = () => reset();

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return {
    handleFormSubmit,
    handleImageInputChange,
    handleFormReset,
    control,
    errors,
    inputImageUrl: imageInputUrl,
    isDirty,
    isSubmitting,
    isValid,
  };
}
