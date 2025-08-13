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
import { useToasts } from '@/common/hooks/use-toasts';
import { FetchClient } from '@/common/infrastructure/adapters/fetch-client.adapter';

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
    const formData = JSON.stringify(data);

    const fetchClient = new FetchClient({
      baseUrl: window.location.origin,
      headers: { 'Content-Type': 'application/json' },
    });

    const fetchResult = await fetchClient.post(
      '/api/auth/sign-in' satisfies Route,
      formData,
    );

    if (!fetchResult.success) {
      const { error } = fetchResult;
      addToast(error.message, 'error');
      return;
    }

    const { data: fetchData } = fetchResult;

    const validationResult = validateSignInApiResponse(fetchData);

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
