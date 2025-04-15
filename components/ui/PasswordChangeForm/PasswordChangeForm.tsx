'use client';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import { usePasswordChangeForm } from './usePasswordChangeForm';

export function PasswordChangeForm() {
  const { handleFormSubmit, register, errors, isValid, isSubmitting } =
    usePasswordChangeForm();

  return (
    <form
      aria-label="password change"
      className="flex flex-col"
      onSubmit={handleFormSubmit}
    >
      <Input
        errorMessage={errors.password?.message}
        label="New password"
        name="password"
        placeholder="Enter new password"
        register={register}
        type="password"
      />
      <Input
        errorMessage={errors.passwordConfirm?.message}
        label="Confirm Password"
        name="passwordConfirm"
        placeholder="Confirm password"
        register={register}
        type="password"
      />
      <SubmitButton
        disabled={!isValid || isSubmitting}
        isSubmitting={isSubmitting}
      >
        Change
      </SubmitButton>
    </form>
  );
}
