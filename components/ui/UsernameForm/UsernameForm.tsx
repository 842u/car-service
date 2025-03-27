'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { SubmitButton } from '@/components/ui/SubmitButton/SubmitButton';
import { useToasts } from '@/hooks/useToasts';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/schemas/zod/common';
import {
  usernameFormSchema,
  UsernameFormValues,
} from '@/schemas/zod/usernameFormSchema';
import { Profile } from '@/types';
import { patchProfile } from '@/utils/supabase/general';
import {
  onErrorProfileQueryMutation,
  onMutateProfileQueryMutation,
} from '@/utils/tanstack/general';

const defaultUsernameFormValues: UsernameFormValues = {
  username: '',
};

type UsernameFormProps = {
  data?: Profile | null;
};

export function UsernameForm({ data }: UsernameFormProps) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: (usernameFormData: UsernameFormValues) =>
      patchProfile({
        property: 'username',
        value: usernameFormData.username.trim(),
      }),
    onMutate: (usernameFormData: UsernameFormValues) =>
      onMutateProfileQueryMutation(
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
      onError: (error, _, context) =>
        onErrorProfileQueryMutation(
          queryClient,
          'session',
          error,
          context,
          addToast,
        ),
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: ['profiles', 'session'] }),
    });
  };

  useEffect(() => {
    data?.username && reset({ username: data.username });
  }, [reset, data?.username]);

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
        <div className="text-sm">
          <p>
            Please enter your full name, or a display name you are comfortable
            with.
          </p>
          <p className="text-alpha-grey-700">
            {`Letters, numbers and single whitespaces allowed. Length between
              ${MIN_USERNAME_LENGTH} and
              ${MAX_USERNAME_LENGTH} characters.`}
          </p>
        </div>
        <div className="my-4 flex justify-center gap-4">
          <Button
            className="flex-1"
            disabled={!isDirty}
            onClick={() => {
              reset({ username: data?.username || '' });
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
