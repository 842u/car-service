import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { NextAuthApiClient } from '@/common/infrastructure/api/next-auth-api-client';
import { FetchClient } from '@/common/infrastructure/http/fetch-client';
import { useToasts } from '@/common/presentation/hooks/use-toasts';
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
    const fetchClient = new FetchClient({
      baseUrl: window.location.origin,
      headers: { 'Content-Type': 'application/json' },
    });

    const nextAuthApiService = new NextAuthApiClient(fetchClient);

    const serviceResult = await nextAuthApiService.passwordChange(data);

    if (!serviceResult.success) {
      addToast(serviceResult.error.message, 'error');
      return;
    }

    addToast('Password changed.', 'success');
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return { handleFormSubmit, register, errors, isValid, isSubmitting };
}
