import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { authClientBrowser } from '@/dependencies/auth-client/browser';
import {
  type PasswordResetFormData,
  passwordResetFormSchema,
} from '@/user/interface/ui/password-reset-form.schema';

const defaultPasswordResetFormValues: PasswordResetFormData = {
  email: '',
};

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

  const handleFormSubmit = handleSubmit(async (formData) => {
    const { email } = formData;

    const resetPasswordResult = await authClientBrowser.resetPassword({
      email,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (!resetPasswordResult.success) {
      const { message } = resetPasswordResult.error;
      addToast(message, 'error');
      return;
    }

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
