'use client';

import { Route } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { UserProfileContext } from '@/context/UserProfileContext';
import { useToasts } from '@/hooks/useToasts';
import { RouteHandlerResponse } from '@/types';
import { unslugify } from '@/utils/general';
import { fetchUserProfile } from '@/utils/supabase/general';
import {
  emailValidationRules,
  passwordValidationRules,
} from '@/utils/validation';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

export type EmailAuthFormType = 'sign-up' | 'sign-in';

type EmailAuthFormValues = {
  email: string;
  password: string;
};

type EmailAuthFormProps = {
  type: EmailAuthFormType;
  strictPasswordCheck?: boolean;
  passwordReminder?: boolean;
  className?: string;
};

export default function EmailAuthForm({
  type,
  strictPasswordCheck = true,
  passwordReminder = false,
  className,
}: EmailAuthFormProps) {
  const router = useRouter();
  const { addToast } = useToasts();
  const { setUserProfile } = useContext(UserProfileContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isValid, isSubmitting, errors },
  } = useForm<EmailAuthFormValues>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
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
      const profileData = await fetchUserProfile();

      setUserProfile((previousState) => ({
        ...previousState,
        ...profileData,
      }));

      router.replace('/dashboard');
      router.refresh();
    }
  };

  useEffect(() => {
    reset();
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
        registerOptions={emailValidationRules}
        type="email"
      />
      <div className="relative">
        <Input
          errorMessage={errors.password?.message}
          label="Password"
          name="password"
          placeholder="Enter your password ..."
          register={register}
          registerOptions={
            strictPasswordCheck
              ? passwordValidationRules
              : { required: 'This field is required' }
          }
          type="password"
        />
        {passwordReminder && (
          <Link
            className="text-light-900 dark:text-dark-200 absolute top-0 right-0 text-sm"
            href="/dashboard/forgot-password"
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
