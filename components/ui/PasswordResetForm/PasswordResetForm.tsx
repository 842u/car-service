'use client';

import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ToastsContext } from '@/context/ToastsContext';
import { RouteHandlerResponse } from '@/types';
import { passwordValidationRules } from '@/utils/validation';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

type PasswordResetFormValues = {
  password: string;
  passwordConfirm: string;
};

export function PasswordResetForm() {
  const { addToast } = useContext(ToastsContext);
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
    const { message, error } = (await response.json()) as RouteHandlerResponse;

    message && addToast(message, 'success');

    error && addToast(error, 'error');
  };

  useEffect(() => reset(), [isSubmitSuccessful, reset]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(submitHandler)}>
      <Input
        errorMessage={errors.password?.message}
        label="New Password"
        name="password"
        placeholder="Enter new password"
        register={register}
        registerOptions={passwordValidationRules}
        type="password"
      />
      <Input
        errorMessage={errors.passwordConfirm?.message}
        label="Confirm New Password"
        name="passwordConfirm"
        placeholder="Confirm new password"
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
