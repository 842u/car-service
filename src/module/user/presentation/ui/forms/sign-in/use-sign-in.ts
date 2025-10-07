import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { dependencyContainer, dependencyTokens } from '@/di';
import type { SignInApiRequest } from '@/user/interface/api/sign-in.schema';
import { signInApiRequestSchema } from '@/user/interface/api/sign-in.schema';

const defaultSignInFormValues: SignInApiRequest = {
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
  } = useForm<SignInApiRequest>({
    resolver: zodResolver(signInApiRequestSchema),
    mode: 'onTouched',
    defaultValues: defaultSignInFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const userApiClient = await dependencyContainer.resolve(
      dependencyTokens.USER_API_CLIENT,
    );

    const signInResult = await userApiClient.signIn(data);

    if (!signInResult.success) {
      addToast(signInResult.error.message, 'error');
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
