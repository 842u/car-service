'use client';

import { Route } from 'next';
import Link from 'next/link';

import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/schemas/zod/common';
import { unslugify } from '@/utils/general';

import { Form } from '../../../common/ui/form/form';
import { useEmailAuthForm } from './useEmailAuthForm';

export type EmailAuthFormType = 'sign-up' | 'sign-in';

type EmailAuthFormProps = {
  type: EmailAuthFormType;
};

export default function EmailAuthForm({ type }: EmailAuthFormProps) {
  const { handleFormSubmit, errors, register, isSubmitting, isDisabled } =
    useEmailAuthForm({ type });

  return (
    <Form
      aria-label="Email Authentication"
      variant="raw"
      onSubmit={handleFormSubmit}
    >
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
          maxLength={type === 'sign-up' ? MAX_PASSWORD_LENGTH : undefined}
          minLength={type === 'sign-up' ? MIN_PASSWORD_LENGTH : undefined}
          name="password"
          placeholder="Enter your password ..."
          register={register}
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
      <Form.ButtonSubmit disabled={isDisabled} isSubmitting={isSubmitting}>
        {unslugify(type, true)}
      </Form.ButtonSubmit>
    </Form>
  );
}
