'use client';

import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ToastsContext } from '@/context/ToastsContext';
import { emailValidationRules } from '@/utils/validation';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import { TextSeparator } from '../TextSeparator/TextSeparator';

type PasswordRemindFormValues = {
  email: string;
};

export function PasswordRemindForm() {
  const { addToast } = useContext(ToastsContext);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isValid, isSubmitting },
  } = useForm<PasswordRemindFormValues>({
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  const submitHandler: SubmitHandler<PasswordRemindFormValues> = async (
    data,
  ) => {
    const { email } = data;
    const { getBrowserClient } = await import('@/utils/supabase');
    const { auth } = getBrowserClient();
    const { data: responseData, error: responseError } =
      await auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
    const resetPasswordMessage =
      'Your password reset request has been received. Please check your email for further instructions.';

    responseData && addToast(resetPasswordMessage, 'success');

    responseError && addToast(responseError.message, 'error');
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(submitHandler)}>
      <Input
        errorMessage={errors.email?.message}
        label="Email"
        name="email"
        placeholder="Enter your email ..."
        register={register}
        registerOptions={emailValidationRules}
        type="email"
      />
      <TextSeparator className="my-5" />
      <SubmitButton
        disabled={!isValid || isSubmitting}
        isSubmitting={isSubmitting}
      >
        Send reset email
      </SubmitButton>
    </form>
  );
}
