import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  type UserNameChangeContract,
  userNameChangeContractSchema,
} from '@/user/interface/contracts/name-change.schema';
import { useUpdateUserName } from '@/user/presentation/ui/forms/name/use-update-user-name';

const defaultNameFormValues: UserNameChangeContract = {
  name: '',
};

export function useNameForm({ name }: { name: string | null | undefined }) {
  const { mutate } = useUpdateUserName();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, errors, isSubmitSuccessful },
  } = useForm<UserNameChangeContract>({
    resolver: zodResolver(userNameChangeContractSchema),
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
