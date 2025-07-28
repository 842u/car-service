'use client';

import { TextSeparator } from '@/features/common/ui/decorative/text-separator/text-separator';

import { Form } from '../../../common/ui/form/form';
import { usePasswordResetForm } from './usePasswordResetForm';

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
