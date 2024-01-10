'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import {
  emailValidationRules,
  passwordValidationRules,
} from '@/utils/validation';

import { ToggleVisibilityButton } from '../ToggleVisibilityButton/ToggleVisibilityButton';

type AuthFormValues = {
  email: string;
  password: string;
};

type AuthFormProps = {
  submitText: string;
  submitUrl: string;
  className: string;
};

export default function AuthForm({
  submitText,
  submitUrl,
  className,
}: AuthFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isValid, isSubmitting, errors },
  } = useForm<AuthFormValues>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const passwordVisibilityHandler = () => {
    setIsPasswordVisible((currentState) => !currentState);
  };

  const submitHandler: SubmitHandler<AuthFormValues> = async (data) => {
    const formData = JSON.stringify(data);

    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    });

    const responseData = await response.json();

    console.log(responseData);
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className={twMerge(
        'flex flex-col items-center justify-center gap-4',
        className,
      )}
      onSubmit={handleSubmit(submitHandler)}
    >
      <label className="w-full" htmlFor="email">
        Email
        <input
          className={twMerge(
            'mt-2 block w-full rounded-md border border-alpha-grey-500 bg-light-600 px-4 py-2 placeholder:text-sm placeholder:text-light-900 focus:border-alpha-grey-500 focus:ring-alpha-grey-700 dark:bg-dark-700 ',
            errors.email?.message
              ? 'border-error-500 bg-error-50 focus:border-error-500 dark:bg-error-900'
              : '',
          )}
          {...register('email', emailValidationRules)}
          id="email"
          placeholder="Enter your email ..."
          type="email"
        />
        <p className="my-2 whitespace-pre-wrap text-sm text-error-400">
          {errors.email?.message || ' '}
        </p>
      </label>
      <label className="w-full" htmlFor="password">
        Password
        <div className="relative">
          <input
            className={twMerge(
              'mt-2 block w-full rounded-md border border-alpha-grey-500 bg-light-600 px-4 py-2 placeholder:text-sm placeholder:text-light-900 focus:border-alpha-grey-500 focus:ring-alpha-grey-700 dark:bg-dark-700 ',
              errors.password?.message
                ? 'border-error-500 bg-error-50 focus:border-error-500 dark:bg-error-900'
                : '',
            )}
            {...register('password', passwordValidationRules)}
            id="password"
            placeholder="Enter your password ..."
            type={isPasswordVisible ? 'text' : 'password'}
          />
          <div className="absolute right-0 top-0 mr-2 flex h-full flex-col items-center justify-center">
            <ToggleVisibilityButton
              className="bg-alpha-grey-500 p-1"
              isVisible={isPasswordVisible}
              onClick={passwordVisibilityHandler}
            />
          </div>
        </div>
        <p className="my-2 whitespace-pre-wrap text-sm text-error-400">
          {errors.password?.message || ' '}
        </p>
      </label>
      <button
        className="rounded-md border border-accent-500 bg-accent-800 px-4 py-2 text-light-500 transition-colors disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800"
        disabled={!isValid || isSubmitting}
        type="submit"
      >
        {submitText}
      </button>
    </form>
  );
}
