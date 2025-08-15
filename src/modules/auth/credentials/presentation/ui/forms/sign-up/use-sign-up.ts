import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  type SignUpFormData,
  signUpFormSchema,
} from '@/auth/credentials/interface/validation/sign-up-form.schema';
import { NextAuthApiService } from '@/auth/infrastructure/services/next-auth-api.service';
import { FetchClient } from '@/common/infrastructure/adapters/fetch-client.adapter';
import { useToasts } from '@/common/presentation/hooks/use-toasts';

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
    const fetchClient = new FetchClient({
      baseUrl: window.location.origin,
      headers: { 'Content-Type': 'application/json' },
    });

    const nextAuthApiService = new NextAuthApiService(fetchClient);

    const serviceResult = await nextAuthApiService.signUp(data);

    if (!serviceResult.success) {
      addToast(serviceResult.error.message, 'error');
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
