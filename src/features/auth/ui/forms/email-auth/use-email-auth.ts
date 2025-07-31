import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/features/common/hooks/use-toasts';
import type { EmailAuthFormValues } from '@/schemas/zod/emailAuthFormSchema';
import {
  signInEmailAuthFormSchema,
  signUpEmailAuthFormSchema,
} from '@/schemas/zod/emailAuthFormSchema';
import type { RouteHandlerResponse } from '@/types';

import type { EmailAuthFormType } from './email-auth';

const defaultEmailAuthFormValues: EmailAuthFormValues = {
  email: '',
  password: '',
};

export function useEmailAuthForm({ type }: { type: EmailAuthFormType }) {
  const router = useRouter();

  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isValid, isSubmitting, errors },
  } = useForm<EmailAuthFormValues>({
    resolver: zodResolver(
      type === 'sign-up'
        ? signUpEmailAuthFormSchema
        : signInEmailAuthFormSchema,
    ),
    mode: 'onTouched',
    defaultValues: defaultEmailAuthFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const url = new URL(window.location.origin);
    url.pathname = '/api/auth/email-auth' satisfies Route;
    url.searchParams.set('type', type);

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

    if (responseData && type === 'sign-in') {
      addToast('Successfully signed in.', 'success');
    }

    if (apiResponse.ok && type === 'sign-in') {
      router.replace('/dashboard');
      router.refresh();
    }

    if (responseData && type === 'sign-up') {
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
