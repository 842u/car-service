'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/hooks/useToasts';
import {
  passwordResetFormSchema,
  PasswordResetFormValues,
} from '@/schemas/zod/passwordResetFormSchema';
import { createClient } from '@/utils/supabase/client';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import { TextSeparator } from '../TextSeparator/TextSeparator';

const defaultPasswordResetFormValues = { email: '' };

export function PasswordResetForm() {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isValid, isSubmitting },
  } = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetFormSchema),
    mode: 'onTouched',
    defaultValues: defaultPasswordResetFormValues,
  });

  const handleFormSubmit = async (formData: PasswordResetFormValues) => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      formData.email,
      { redirectTo: window.location.origin },
    );

    error && addToast(error.message, 'error');

    data &&
      addToast(
        'Your password reset request has been received. Please check your email for further instructions.',
        'success',
      );
  };

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(handleFormSubmit)}>
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
