import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import {
  usernameFormSchema,
  UsernameFormValues,
} from '@/schemas/zod/usernameFormSchema';
import { updateCurrentSessionProfile } from '@/utils/supabase/tables/profiles';
import { queryKeys } from '@/utils/tanstack/keys';
import { profilesUpdateOnMutate } from '@/utils/tanstack/profiles';

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
    mutationFn: (usernameFormData: UsernameFormValues) =>
      updateCurrentSessionProfile({
        property: 'username',
        value: usernameFormData.username.trim(),
      }),
    onMutate: (usernameFormData: UsernameFormValues) =>
      profilesUpdateOnMutate(
        queryClient,
        'session',
        'username',
        usernameFormData.username.trim(),
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
    async (usernameFormData: UsernameFormValues) => {
      mutate(usernameFormData, {
        onSuccess: () => {
          addToast('Username updated successfully.', 'success');
        },
        onError: (error, _, context) => {
          addToast(error.message, 'error');

          queryClient.setQueryData(
            queryKeys.profilesCurrentSession,
            context?.previousQueryData,
          );
        },
        onSettled: () =>
          queryClient.invalidateQueries({
            queryKey: queryKeys.profilesCurrentSession,
          }),
      });
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
