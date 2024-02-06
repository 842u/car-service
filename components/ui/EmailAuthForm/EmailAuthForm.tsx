'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import {
  emailValidationRules,
  passwordValidationRules,
} from '@/utils/validation';

import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';

type EmailAuthFormValues = {
  email: string;
  password: string;
};

type EmailAuthFormProps = {
  submitText: string;
  submitUrl: string;
  strictPasswordCheck?: boolean;
  className?: string;
};

export default function EmailAuthForm({
  submitText,
  submitUrl,
  strictPasswordCheck = true,
  className,
}: EmailAuthFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isValid, isSubmitting, errors },
  } = useForm<EmailAuthFormValues>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const submitHandler: SubmitHandler<EmailAuthFormValues> = async (data) => {
    const formData = JSON.stringify(data);

    const response = await fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    });

    const responseData = await response.json();

    console.log(responseData);
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      className={twMerge('flex flex-col', className)}
      data-testid="auth-form"
      onSubmit={handleSubmit(submitHandler)}
    >
      <Input
        errorMessage={errors.email?.message}
        label="Email"
        name="email"
        placeholder="Enter your email ..."
        register={register}
        registerOptions={emailValidationRules}
        type="email"
      />
      <Input
        errorMessage={errors.password?.message}
        label="Password"
        name="password"
        placeholder="Enter your password ..."
        register={register}
        registerOptions={
          strictPasswordCheck
            ? passwordValidationRules
            : { required: 'This field is required' }
        }
        type="password"
      />
      <SubmitButton
        disabled={!isValid || isSubmitting}
        isSubmitting={isSubmitting}
      >
        {submitText}
      </SubmitButton>
    </form>
  );
}
