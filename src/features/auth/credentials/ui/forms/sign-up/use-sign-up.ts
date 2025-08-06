import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from 'next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { signUpApiResponseSchema } from '@/auth/credentials/application/validation/api/sign-up.schema';
import {
  signUpFormSchema,
  type SignUpFormValues,
} from '@/auth/credentials/application/validation/sign-up-form.schema';
import { useToasts } from '@/features/common/hooks/use-toasts';

const defaultSignUpFormValues: SignUpFormValues = {
  email: '',
  password: '',
};

export function useSignUpForm() {
  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isValid, isSubmitting, errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onTouched',
    defaultValues: defaultSignUpFormValues,
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

    let body: unknown;

    try {
      body = await apiResponse.json();
    } catch (_) {
      addToast('Malformed JSON response.', 'error');

      return;
    }

    const result = signUpApiResponseSchema.safeParse(body);

    if (!result.success) {
      addToast(result.error.message, 'error');

      return;
    }

    addToast(
      'Welcome! To get started, please check your email and click the confirmation link.',
      'success',
    );
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
