import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FetchClient } from '@/common/infrastructure/http/fetch-client';
import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { NextAuthApiClient } from '@/user/infrastructure/api/next-auth-api-client';
import {
  type SignInContract,
  signInContractSchema,
} from '@/user/interface/contracts/sign-in.schema';

const defaultSignInFormValues: SignInContract = {
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
  } = useForm<SignInContract>({
    resolver: zodResolver(signInContractSchema),
    mode: 'onTouched',
    defaultValues: defaultSignInFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const fetchClient = new FetchClient({
      baseUrl: window.location.origin,
      headers: { 'Content-Type': 'application/json' },
    });

    const nextAuthApiService = new NextAuthApiClient(fetchClient);

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
