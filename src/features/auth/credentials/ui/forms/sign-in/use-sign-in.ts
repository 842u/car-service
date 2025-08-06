import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  signInFormSchema,
  type SignInFormValues,
} from '@/auth/credentials/application/validation/sign-in-form.schema';
import type { RouteHandlerResponse } from '@/common/types';
import { useToasts } from '@/features/common/hooks/use-toasts';

const defaultSignInFormValues: SignInFormValues = {
  email: '',
  password: '',
};

export function useSignInForm() {
  const router = useRouter();

  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isValid, isSubmitting, errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    mode: 'onTouched',
    defaultValues: defaultSignInFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const url = new URL(window.location.origin);
    url.pathname = '/api/auth/sign-in' satisfies Route;

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
      addToast('Successfully signed in.', 'success');
      router.replace('/dashboard');
      router.refresh();
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
