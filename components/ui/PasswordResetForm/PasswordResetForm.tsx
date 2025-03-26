'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import { RouteHandlerResponse } from '@/types';
import {
  passwordResetFormSchema,
  PasswordResetFormValues,
} from '@/utils/validation';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

const defaultPasswordResetFormValues: PasswordResetFormValues = {
  password: '',
  passwordConfirm: '',
};

export function PasswordResetForm() {
  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isValid, isSubmitting },
  } = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetFormSchema),
    mode: 'onTouched',
    defaultValues: defaultPasswordResetFormValues,
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

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

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
        type="password"
      />
      <Input
        errorMessage={errors.passwordConfirm?.message}
        label="Confirm Password"
        name="passwordConfirm"
        placeholder="Confirm password"
        register={register}
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
