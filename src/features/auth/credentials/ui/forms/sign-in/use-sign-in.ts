import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { validateSignInApiResponse } from '@/auth/credentials/interface/validation/api/sign-in.schema';
import {
  type SignInFormData,
  signInFormSchema,
} from '@/auth/credentials/interface/validation/sign-in-form.schema';
import { useToasts } from '@/features/common/hooks/use-toasts';

const defaultSignInFormValues: SignInFormData = {
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
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    mode: 'onTouched',
    defaultValues: defaultSignInFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const url = new URL(window.location.origin);

    url.pathname = '/api/auth/sign-in' satisfies Route;

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

    const validationResult = validateSignInApiResponse(body);

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

    addToast('Signed in.', 'success');

    router.replace('/dashboard');
    router.refresh();
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
