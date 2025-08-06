import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from 'next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  signUpFormSchema,
  type SignUpFormValues,
} from '@/auth/credentials/application/validation/sign-up-form.schema';
import type { RouteHandlerResponse } from '@/common/types';
import { useToasts } from '@/features/common/hooks/use-toasts';

const defaultEmailAuthFormValues: SignUpFormValues = {
  email: '',
  password: '',
};

export function useEmailAuthForm() {
  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isValid, isSubmitting, errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onTouched',
    defaultValues: defaultEmailAuthFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const url = new URL(window.location.origin);
    url.pathname = '/api/auth/sign-up' satisfies Route;

    const formData = JSON.stringify(data);
    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
    });

    const { data: responseData, error } =
      (await apiResponse.json()) as RouteHandlerResponse;

    error && addToast(error.message, 'error');

    if (responseData) {
      addToast(
        'Welcome! To get started, please check your email and click the confirmation link.',
        'success',
      );
    }
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return {
    register,
    isDisabled: !isValid || isSubmitting,
    isSubmitting,
    errors,
    handleFormSubmit,
  };
}
