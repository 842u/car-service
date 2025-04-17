'use client';

import { Form } from '../Form/Form';
import { usePasswordChangeForm } from './usePasswordChangeForm';

export function PasswordChangeForm() {
  const { handleFormSubmit, register, errors, isValid, isSubmitting } =
    usePasswordChangeForm();

  return (
    <Form
      aria-label="password change"
      className="flex flex-col"
      variant="raw"
      onSubmit={handleFormSubmit}
    >
      <Form.InputWrapper>
        <Form.InputPassword
          className="md:w-72"
          errorMessage={errors.password?.message}
          label="New password"
          name="password"
          placeholder="Enter new password"
          register={register}
        />
        <Form.InputPassword
          className="md:w-72"
          errorMessage={errors.passwordConfirm?.message}
          label="Confirm Password"
          name="passwordConfirm"
          placeholder="Confirm password"
          register={register}
        />
      </Form.InputWrapper>
      <Form.Controls>
        <Form.ButtonSubmit
          disabled={!isValid || isSubmitting}
          isSubmitting={isSubmitting}
        >
          Save
        </Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
