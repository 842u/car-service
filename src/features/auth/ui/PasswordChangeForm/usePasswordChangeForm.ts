import { zodResolver } from '@hookform/resolvers/zod';
import { Route } from 'next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/features/common/hooks/useToasts';
import {
  passwordChangeFormSchema,
  PasswordChangeFormValues,
} from '@/schemas/zod/passwordChangeFormSchema';
import { RouteHandlerResponse } from '@/types';

const defaultPasswordChangeFormValues: PasswordChangeFormValues = {
  password: '',
  passwordConfirm: '',
};

export function usePasswordChangeForm() {
  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isValid, isSubmitting },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeFormSchema),
    mode: 'onTouched',
    defaultValues: defaultPasswordChangeFormValues,
  });

  const handleFormSubmit = handleSubmit(
    async (data: PasswordChangeFormValues) => {
      const password = JSON.stringify(data);

      const response = await fetch(
        '/api/auth/password-change' satisfies Route,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: password,
        },
      );

      const { data: responseData, error } =
        (await response.json()) as RouteHandlerResponse;

      error && addToast(error.message, 'error');

      responseData && addToast('Your password has been changed.', 'success');
    },
  );

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return { handleFormSubmit, register, errors, isValid, isSubmitting };
}
