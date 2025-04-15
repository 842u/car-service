'use client';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import { TextSeparator } from '../TextSeparator/TextSeparator';
import { usePasswordResetForm } from './usePasswordResetForm';

export function PasswordResetForm() {
  const { handleFormSubmit, errors, register, isValid, isSubmitting } =
    usePasswordResetForm();

  return (
    <form className="flex flex-col" onSubmit={handleFormSubmit}>
      <Input
        errorMessage={errors.email?.message}
        label="Email"
        name="email"
        placeholder="Enter your email ..."
        register={register}
        type="email"
      />
      <TextSeparator className="my-5" />
      <SubmitButton
        disabled={!isValid || isSubmitting}
        isSubmitting={isSubmitting}
      >
        Send password reset email
      </SubmitButton>
    </form>
  );
}
