import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { dependencyContainer, dependencyTokens } from '@/di';
import type { PasswordChangeApiContract } from '@/user/interface/api/password-change.schema';
import { passwordChangeApiContractSchema } from '@/user/interface/api/password-change.schema';

const defaultPasswordChangeFormValues: PasswordChangeApiContract = {
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
  } = useForm<PasswordChangeApiContract>({
    resolver: zodResolver(passwordChangeApiContractSchema),
    mode: 'onTouched',
    defaultValues: defaultPasswordChangeFormValues,
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    const userApiClient = await dependencyContainer.resolve(
      dependencyTokens.USER_API_CLIENT,
    );

    const passwordChangeResult = await userApiClient.passwordChange(data);

    if (!passwordChangeResult.success) {
      addToast(passwordChangeResult.error.message, 'error');
      return;
    }

    addToast('Password changed.', 'success');
  });

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return { handleFormSubmit, register, errors, isValid, isSubmitting };
}
