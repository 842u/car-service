import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/presentation/hooks/use-toasts';
import {
  type PasswordResetFormData,
  passwordResetFormSchema,
} from '@/user/interface/validation/forms/password-reset.schema';
import { createClient } from '@/utils/supabase/client';

const defaultPasswordResetFormValues: PasswordResetFormData = { email: '' };

export function usePasswordResetForm() {
  const { addToast } = useToasts();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isValid, isSubmitting },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetFormSchema),
    mode: 'onTouched',
    defaultValues: defaultPasswordResetFormValues,
  });

  const handleFormSubmit = handleSubmit(
    async (formData: PasswordResetFormData) => {
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
    },
  );

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
