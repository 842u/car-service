import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/presentation/hooks/use-toasts';
import { dependencyContainer, dependencyTokens } from '@/di';
import {
  type SignUpContract,
  signUpContractSchema,
} from '@/user/interface/contracts/sign-up.schema';

const defaultSignUpFormValues: SignUpContract = {
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
  } = useForm<SignUpContract>({
    resolver: zodResolver(signUpContractSchema),
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
