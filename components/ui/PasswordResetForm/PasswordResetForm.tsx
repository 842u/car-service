'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import { RouteHandlerResponse } from '@/types';
import { passwordValidationRules } from '@/utils/validation';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

type PasswordResetFormValues = {
  password: string;
  passwordConfirm: string;
};

export function PasswordResetForm() {
  const { addToast } = useToasts();
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitSuccessful, isValid, isSubmitting },
  } = useForm<PasswordResetFormValues>({
    mode: 'onTouched',
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  });

  const submitHandler: SubmitHandler<PasswordResetFormValues> = async (
    data,
  ) => {
    const password = JSON.stringify(data);
    const response = await fetch('/api/auth/password-reset', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: password,
    });
    const { data: responseData, error } =
      (await response.json()) as RouteHandlerResponse;

    error && addToast(error.message, 'error');

    responseData && addToast('Your password has been changed.', 'success');
  };

  useEffect(() => reset(), [isSubmitSuccessful, reset]);

  return (
    <form
      aria-label="password reset"
      className="flex flex-col"
      onSubmit={handleSubmit(submitHandler)}
    >
      <Input
        errorMessage={errors.password?.message}
        label="New password"
        name="password"
        placeholder="Enter new password"
        register={register}
        registerOptions={passwordValidationRules}
        type="password"
      />
      <Input
        errorMessage={errors.passwordConfirm?.message}
        label="Confirm Password"
        name="passwordConfirm"
        placeholder="Confirm password"
        register={register}
        registerOptions={{
          required: 'This field is required.',
          validate: (value) =>
            value === getValues('password') || 'Password not match.',
        }}
        type="password"
      />
      <SubmitButton
        disabled={!isValid || isSubmitting}
        isSubmitting={isSubmitting}
      >
        Reset
      </SubmitButton>
    </form>
  );
}
