'use client';

import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { Form } from '@/ui/form/form';

import { usePasswordResetForm } from './use-password-reset-form';

export function PasswordResetForm() {
  const { handleFormSubmit, errors, register, isDisabled, isSubmitting } =
    usePasswordResetForm();

  return (
    <Form className="flex flex-col" variant="raw" onSubmit={handleFormSubmit}>
      <Form.Input
        errorMessage={errors.email?.message}
        label="Email"
        name="email"
        placeholder="Enter your email ..."
        register={register}
        type="email"
      />
      <TextSeparator className="mb-4" />
      <Form.ButtonSubmit disabled={isDisabled} isSubmitting={isSubmitting}>
        Send password reset email
      </Form.ButtonSubmit>
    </Form>
  );
}
