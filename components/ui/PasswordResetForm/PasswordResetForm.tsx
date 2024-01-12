'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { passwordValidationRules } from '@/utils/validation';

type PasswordResetFormValues = {
  password: string;
  passwordConfirm: string;
};

export function PasswordResetForm() {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitSuccessful },
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
    const responseData = await response.json();

    console.log(responseData);
  };

  useEffect(() => reset(), [isSubmitSuccessful, reset]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(submitHandler)}>
      <label className="flex flex-col" htmlFor="password">
        New password.
        <input
          className={twMerge(
            'mt-2 block w-full rounded-md border border-alpha-grey-500 bg-light-600 px-4 py-2 placeholder:text-sm placeholder:text-light-900 focus:border-alpha-grey-500 focus:ring-alpha-grey-700 dark:bg-dark-700 ',
            errors.password?.message
              ? 'border-error-500 bg-error-50 focus:border-error-500 dark:bg-error-900'
              : '',
          )}
          id="new-password"
          type="text"
          {...register('password', passwordValidationRules)}
        />
        <p className="my-2 whitespace-pre-wrap text-sm text-error-400">
          {errors.password?.message || ' '}
        </p>
      </label>
      <label className="flex flex-col" htmlFor="confirm-new-password">
        Confirm new password.
        <input
          className={twMerge(
            'mt-2 block w-full rounded-md border border-alpha-grey-500 bg-light-600 px-4 py-2 placeholder:text-sm placeholder:text-light-900 focus:border-alpha-grey-500 focus:ring-alpha-grey-700 dark:bg-dark-700 ',
            errors.passwordConfirm?.message
              ? 'border-error-500 bg-error-50 focus:border-error-500 dark:bg-error-900'
              : '',
          )}
          type="text"
          {...register('passwordConfirm', {
            required: 'This field is required.',
            validate: (value) =>
              value === getValues('password') || 'Password not match.',
          })}
        />
        <p className="my-2 whitespace-pre-wrap text-sm text-error-400">
          {errors.passwordConfirm?.message || ' '}
        </p>
      </label>
      <button type="submit">Reset</button>
    </form>
  );
}
