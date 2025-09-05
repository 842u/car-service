'use client';

import type { Route } from 'next';
import Link from 'next/link';

import { Form } from '@/ui/form/form';

import { useSignInForm } from './use-sign-in';

export function SignInForm() {
  const { handleFormSubmit, errors, register, isSubmitting, isDisabled } =
    useSignInForm();

  return (
    <Form aria-label="sign in form" variant="raw" onSubmit={handleFormSubmit}>
      <Form.Input
        errorMessage={errors.email?.message}
        label="Email"
        name="email"
        placeholder="Enter your email ..."
        register={register}
        type="email"
      />
      <div className="relative">
        <Form.InputPassword
          errorMessage={errors.password?.message}
          label="Password"
          name="password"
          placeholder="Enter your password ..."
          register={register}
        />
        <Link
          className="text-light-900 dark:text-dark-200 absolute top-0 right-0 text-sm"
          href={'/dashboard/forgot-password' satisfies Route}
        >
          Forgot Password?
        </Link>
      </div>
      <Form.ButtonSubmit disabled={isDisabled} isSubmitting={isSubmitting}>
        Sign In
      </Form.ButtonSubmit>
    </Form>
  );
}
