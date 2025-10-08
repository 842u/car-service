import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { userApiClient } from '@/dependencies/api-client/user';
import {
  type SignUpFormData,
  signUpFormDataSchema,
} from '@/user/interface/ui/sign-up-form.schema';

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
    resolver: zodResolver(signUpFormDataSchema),
    mode: 'onTouched',
    defaultValues: defaultSignUpFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
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
