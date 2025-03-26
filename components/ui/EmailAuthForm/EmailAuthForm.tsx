'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { useToasts } from '@/hooks/useToasts';
import { RouteHandlerResponse } from '@/types';
import { unslugify } from '@/utils/general';
import {
  EmailAuthFormValues,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  signInEmailAuthFormSchema,
  signUpEmailAuthFormSchema,
} from '@/utils/validation';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

const defaultEmailAuthFormValues: EmailAuthFormValues = {
  email: '',
  password: '',
};

export type EmailAuthFormType = 'sign-up' | 'sign-in';

type EmailAuthFormProps = {
  type: EmailAuthFormType;
  className?: string;
};

export default function EmailAuthForm({ type, className }: EmailAuthFormProps) {
  const router = useRouter();

  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isValid, isSubmitting, errors },
  } = useForm<EmailAuthFormValues>({
    resolver: zodResolver(
      type === 'sign-up'
        ? signUpEmailAuthFormSchema
        : signInEmailAuthFormSchema,
    ),
    mode: 'onTouched',
    defaultValues: defaultEmailAuthFormValues,
  });

  const submitHandler: SubmitHandler<EmailAuthFormValues> = async (data) => {
    const url = new URL(window.location.origin);

    url.pathname = '/api/auth/email-auth' satisfies Route;
    url.searchParams.set('type', type);

    const formData = JSON.stringify(data);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    });

    const { data: responseData, error } =
      (await response.json()) as RouteHandlerResponse;

    error && addToast(error.message, 'error');

    if (responseData && type === 'sign-in') {
      addToast('Successfully signed in.', 'success');
    }

    if (responseData && type === 'sign-up') {
      addToast(
        'Welcome! To get started, please check your email and click the confirmation link.',
        'success',
      );
    }

    if (response.ok && type === 'sign-in') {
      router.replace('/dashboard');
      router.refresh();
    }
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      aria-label="Email Authentication"
      className={twMerge('flex flex-col', className)}
      onSubmit={handleSubmit(submitHandler)}
    >
      <Input
        errorMessage={errors.email?.message}
        label="Email"
        name="email"
        placeholder="Enter your email ..."
        register={register}
        type="email"
      />
      <div className="relative">
        <Input
          errorMessage={errors.password?.message}
          label="Password"
          maxLength={(type === 'sign-up' && MAX_PASSWORD_LENGTH) || undefined}
          minLength={(type === 'sign-up' && MIN_PASSWORD_LENGTH) || undefined}
          name="password"
          placeholder="Enter your password ..."
          register={register}
          type="password"
        />
        {type === 'sign-in' && (
          <Link
            className="text-light-900 dark:text-dark-200 absolute top-0 right-0 text-sm"
            href={'/dashboard/forgot-password' satisfies Route}
          >
            Forgot Password?
          </Link>
        )}
      </div>
      <SubmitButton
        disabled={!isValid || isSubmitting}
        isSubmitting={isSubmitting}
      >
        {unslugify(type, true)}
      </SubmitButton>
    </form>
  );
}
