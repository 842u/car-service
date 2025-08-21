import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/presentation/hooks/use-toasts';
import {
  type ResetUserPasswordContract,
  resetUserPasswordContractSchema,
} from '@/user/interface/contracts/reset-user-password.schema';
import { createClient } from '@/utils/supabase/client';

const defaultPasswordResetFormValues: ResetUserPasswordContract = {
  email: '',
};

export function usePasswordResetForm() {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isValid, isSubmitting },
  } = useForm<ResetUserPasswordContract>({
    resolver: zodResolver(resetUserPasswordContractSchema),
    mode: 'onTouched',
    defaultValues: defaultPasswordResetFormValues,
  });

  const handleFormSubmit = handleSubmit(async (formData) => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      formData.email,
      { redirectTo: window.location.origin },
    );

    error && addToast(error.message, 'error');

    data &&
      addToast(
        'Your password reset request has been received. Please check your email for further instructions.',
        'success',
      );
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return {
    handleFormSubmit,
    register,
    errors,
    isDisabled: !isValid || isSubmitting,
    isSubmitting,
  };
}
