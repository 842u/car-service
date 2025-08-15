import { zodResolver } from '@hookform/resolvers/zod';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/hooks/use-toasts';
import type { UsernameFormValues } from '@/schemas/zod/usernameFormSchema';
import { usernameFormSchema } from '@/schemas/zod/usernameFormSchema';
import { updateCurrentSessionProfile } from '@/utils/supabase/tables/profiles';
import { queryKeys } from '@/utils/tanstack/keys';
import { profilesUpdateOnMutate } from '@/utils/tanstack/profiles';

type MutationVariables = {
  formData: UsernameFormValues;
  queryClient: QueryClient;
};

const defaultUsernameFormValues: UsernameFormValues = {
  username: '',
};

export function useUsernameForm({
  username,
}: {
  username: string | null | undefined;
}) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData: { username } }: MutationVariables) =>
      updateCurrentSessionProfile({
        property: 'username',
        value: username.trim(),
      }),
    onMutate: ({ queryClient, formData: { username } }) =>
      profilesUpdateOnMutate(
        queryClient,
        'session',
        'username',
        username.trim(),
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, errors, isSubmitSuccessful },
  } = useForm<UsernameFormValues>({
    resolver: zodResolver(usernameFormSchema),
    mode: 'onChange',
    defaultValues: defaultUsernameFormValues,
  });

  const handleFormSubmit = handleSubmit(
    async (formData: UsernameFormValues) => {
      mutate(
        { formData, queryClient },
        {
          onSuccess: () => {
            addToast('Username updated successfully.', 'success');
          },
          onError: (error, { queryClient }, context) => {
            addToast(error.message, 'error');

            queryClient.setQueryData(
              queryKeys.profilesCurrentSession,
              context?.previousQueryData,
            );
          },
          onSettled: (_, __, { queryClient }) =>
            queryClient.invalidateQueries({
              queryKey: queryKeys.profilesCurrentSession,
            }),
        },
      );
    },
  );

  const handleFormReset = () => username && reset({ username });

  useEffect(() => {
    username && reset({ username });
  }, [username, reset]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return {
    handleFormSubmit,
    handleFormReset,
    register,
    isValid,
    isDirty,
    errors,
  };
}
