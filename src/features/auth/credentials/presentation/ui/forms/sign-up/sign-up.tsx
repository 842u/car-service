'use client';

import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '@/auth/credentials/domain/password.schema';
import { Form } from '@/ui/form/form';

import { useSignUpForm } from './use-sign-up';

export function SignUpForm() {
  const { handleFormSubmit, errors, register, isSubmitting, isDisabled } =
    useSignUpForm();

  return (
    <Form aria-label="sign up form" variant="raw" onSubmit={handleFormSubmit}>
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
          maxLength={MAX_PASSWORD_LENGTH}
          minLength={MIN_PASSWORD_LENGTH}
          name="password"
          placeholder="Enter your password ..."
          register={register}
        />
      </div>
      <Form.ButtonSubmit disabled={isDisabled} isSubmitting={isSubmitting}>
        Sign Up
      </Form.ButtonSubmit>
    </Form>
  );
}
