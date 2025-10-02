import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { dependencyContainer, dependencyTokens } from '@/di';
import type { SignUpApiContract } from '@/user/interface/api/sign-up.schema';
import { signUpApiContractSchema } from '@/user/interface/api/sign-up.schema';

const defaultSignUpFormValues: SignUpApiContract = {
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
  } = useForm<SignUpApiContract>({
    resolver: zodResolver(signUpApiContractSchema),
    mode: 'onTouched',
    defaultValues: defaultSignUpFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const userApiClient = await dependencyContainer.resolve(
      dependencyTokens.USER_API_CLIENT,
    );

    const signUpResult = await userApiClient.signUp(data);

    if (!signUpResult.success) {
      addToast(signUpResult.error.message, 'error');
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
