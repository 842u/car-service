import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import type { UserNameChangeApiContract } from '@/user/interface/api/name-change.schema';
import { userNameChangeApiContractSchema } from '@/user/interface/api/name-change.schema';
import { useUserNameChange } from '@/user/presentation/ui/forms/name/use-user-name-change';

const defaultNameFormValues: UserNameChangeApiContract = {
  name: '',
};

export function useNameForm({ name }: { name: string | null | undefined }) {
  const { mutate } = useUserNameChange();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, errors, isSubmitSuccessful },
  } = useForm<UserNameChangeApiContract>({
    resolver: zodResolver(userNameChangeApiContractSchema),
    mode: 'onChange',
    defaultValues: defaultNameFormValues,
  });

  const handleFormSubmit = handleSubmit(async (formData) => {
    mutate(formData);
  });

  const handleFormReset = () => name && reset({ name });

  useEffect(() => {
    name && reset({ name });
  }, [name, reset]);

  useEffect(() => {
    isSubmitSuccessful && reset();
  }, [isSubmitSuccessful, reset]);

  return {
    handleFormSubmit,
    handleFormReset,
    register,
    isValid,
    isDirty,
    errors,
  };
}
