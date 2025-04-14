'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { SubmitButton } from '@/components/ui/SubmitButton/SubmitButton';
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

type UsernameFormProps = {
  username?: string | null;
};

export function UsernameForm({ username }: UsernameFormProps) {
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

  const handleFormSubmit = async (usernameFormData: UsernameFormValues) => {
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
  };

  useEffect(() => {
    username && reset({ username: username });
  }, [reset, username]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="items-center justify-between lg:flex"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="lg:w-1/3 lg:p-4">
        <Input
          errorMessage={errors.username?.message}
          label="Username"
          name="username"
          placeholder="Enter your username"
          register={register}
          type="text"
        />
      </div>
      <div className="w-full flex-1">
        <div className="my-4 flex justify-center gap-4">
          <Button
            className="flex-1"
            disabled={!isDirty}
            onClick={() => {
              reset({ username: username || '' });
            }}
          >
            Reset
          </Button>
          <SubmitButton className="flex-1" disabled={!isValid || !isDirty}>
            Save
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}
