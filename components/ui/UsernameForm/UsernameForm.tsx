'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { SubmitButton } from '@/components/ui/SubmitButton/SubmitButton';
import { useToasts } from '@/hooks/useToasts';
import { Profile } from '@/types';
import { patchProfile } from '@/utils/supabase/general';
import {
  onErrorProfileQueryMutation,
  onMutateProfileQueryMutation,
} from '@/utils/tanstack/general';
import { usernameValidationRules } from '@/utils/validation';

export type UsernameFormValues = {
  username: string;
};

type UsernameFormProps = {
  data?: Profile | null;
  error: Error | null;
  isSuccess: boolean;
  isError: boolean;
};

export function UsernameForm({
  data,
  error,
  isSuccess,
  isError,
}: UsernameFormProps) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (usernameFormData: UsernameFormValues) =>
      patchProfile({
        property: 'username',
        value: usernameFormData.username.trim(),
      }),
    onMutate: (usernameFormData: UsernameFormValues) =>
      onMutateProfileQueryMutation(
        queryClient,
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
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  });

  const submitHandler = async (usernameFormData: UsernameFormValues) => {
    mutate(usernameFormData, {
      onSuccess: () => {
        addToast('Username updated successfully.', 'success');
      },
      onError: (error, _, context) =>
        onErrorProfileQueryMutation(queryClient, error, context, addToast),
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
    });
  };

  useEffect(() => {
    isError &&
      addToast(error?.message || 'Error on updating profile.', 'error');
  }, [isError, addToast, error]);

  useEffect(() => {
    isSuccess && reset({ username: data?.username || '' });
  }, [isSuccess, reset, data?.username]);

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className="items-center justify-between lg:flex"
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="lg:w-1/3 lg:p-4">
        <Input
          errorMessage={errors.username?.message}
          label="Username"
          name="username"
          placeholder="Enter your username"
          register={register}
          registerOptions={usernameValidationRules}
          showErrorMessage={false}
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
              ${usernameValidationRules.minLength.value} and
              ${usernameValidationRules.maxLength.value} characters.`}
          </p>
        </div>
        <div className="my-4 flex justify-center gap-4">
          <SubmitButton className="flex-1" disabled={!isValid || !isDirty}>
            Save
          </SubmitButton>
          <Button
            className="flex-1"
            disabled={!isDirty}
            onClick={() => {
              reset({ username: data?.username || '' });
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
