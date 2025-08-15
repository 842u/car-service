import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  type SignInFormData,
  signInFormSchema,
} from '@/auth/credentials/interface/validation/sign-in-form.schema';
import { NextAuthApiService } from '@/auth/infrastructure/services/next-auth-api.service';
import { FetchClient } from '@/common/infrastructure/adapters/fetch-client.adapter';
import { useToasts } from '@/common/presentation/hooks/use-toasts';

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
    const fetchClient = new FetchClient({
      baseUrl: window.location.origin,
      headers: { 'Content-Type': 'application/json' },
    });

    const nextAuthApiService = new NextAuthApiService(fetchClient);

    const serviceResult = await nextAuthApiService.signIn(data);

    if (!serviceResult.success) {
      addToast(serviceResult.error.message, 'error');
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
