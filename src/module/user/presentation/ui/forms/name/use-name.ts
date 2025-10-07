import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { UserNameChangeApiRequest } from '@/user/interface/api/name-change.schema';
import { userNameChangeApiRequestSchema } from '@/user/interface/api/name-change.schema';
import { useUserNameChange } from '@/user/presentation/ui/forms/name/use-name-change';

const defaultNameFormValues: UserNameChangeApiRequest = {
  name: '',
};

export function useNameForm({ name }: { name: string | null | undefined }) {
  const { mutateAsync } = useUserNameChange();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, errors, isSubmitting, isSubmitSuccessful },
  } = useForm<UserNameChangeApiRequest>({
    resolver: zodResolver(userNameChangeApiRequestSchema),
    mode: 'onChange',
    defaultValues: defaultNameFormValues,
  });

  const handleFormSubmit = handleSubmit(async (formData) => {
    await mutateAsync(formData);
  });

  const handleFormReset = () => name && reset({ name });

  const canReset = isDirty && !isSubmitting;

  const canSubmit = isValid && isDirty && !isSubmitting;

  useEffect(() => {
    !isSubmitting && name && reset({ name });
  }, [name, reset, isSubmitting]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return {
    handleFormSubmit,
    handleFormReset,
    register,
    isSubmitting,
    errors,
    canReset,
    canSubmit,
  };
}
