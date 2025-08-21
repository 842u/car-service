import { zodResolver } from '@hookform/resolvers/zod';
import type { Route } from 'next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/presentation/hooks/use-toasts';
import type { RouteHandlerResponse } from '@/common/types';
import {
  type PasswordChangeContract,
  passwordChangeContractSchema,
} from '@/user/interface/contracts/password-change.schema';

const defaultPasswordChangeFormValues: PasswordChangeContract = {
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
  } = useForm<PasswordChangeContract>({
    resolver: zodResolver(passwordChangeContractSchema),
    mode: 'onTouched',
    defaultValues: defaultPasswordChangeFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const password = JSON.stringify(data);

    const response = await fetch('/api/auth/password-change' satisfies Route, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: password,
    });

    const { data: responseData, error } =
      (await response.json()) as RouteHandlerResponse;

    error && addToast(error.message, 'error');

    responseData && addToast('Your password has been changed.', 'success');
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return { handleFormSubmit, register, errors, isValid, isSubmitting };
}
