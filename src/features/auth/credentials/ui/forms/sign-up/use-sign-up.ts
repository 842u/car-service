import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from 'next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { validateSignUpApiResponse } from '@/auth/credentials/interface/validation/api/sign-up.schema';
import {
  type SignUpFormData,
  signUpFormSchema,
} from '@/auth/credentials/interface/validation/sign-up-form.schema';
import { useToasts } from '@/common/hooks/use-toasts';

const defaultSignUpFormValues: SignUpFormData = {
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
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onTouched',
    defaultValues: defaultSignUpFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const url = new URL(window.location.origin);

    url.pathname = '/api/auth/sign-up' satisfies Route;

    const formData = JSON.stringify(data);

    let response: Response;

    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: formData,
      });
    } catch (_) {
      addToast('Unable to connect to the server.', 'error');

      return;
    }

    let body: unknown;

    try {
      body = await response.json();
    } catch (_) {
      addToast('Invalid API response JSON.', 'error');

      return;
    }

    const validationResult = validateSignUpApiResponse(body);

    if (!validationResult.success) {
      const { error } = validationResult;

      addToast(error.message, 'error');

      return;
    }

    const responseResult = validationResult.data;

    if (!responseResult.success) {
      const { error } = responseResult;

      addToast(error.message, 'error');

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
