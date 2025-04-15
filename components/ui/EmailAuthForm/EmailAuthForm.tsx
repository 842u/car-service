'use client';

import { Route } from 'next';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/schemas/zod/common';
import { unslugify } from '@/utils/general';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import { useEmailAuthForm } from './useEmailAuthForm';

export type EmailAuthFormType = 'sign-up' | 'sign-in';

type EmailAuthFormProps = {
  type: EmailAuthFormType;
  className?: string;
};

export default function EmailAuthForm({ type, className }: EmailAuthFormProps) {
  const { handleFormSubmit, errors, register, isSubmitting, isValid } =
    useEmailAuthForm({ type });

  return (
    <form
      aria-label="Email Authentication"
      className={twMerge('flex flex-col', className)}
      onSubmit={handleFormSubmit}
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
          maxLength={type === 'sign-up' ? MAX_PASSWORD_LENGTH : undefined}
          minLength={type === 'sign-up' ? MIN_PASSWORD_LENGTH : undefined}
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
