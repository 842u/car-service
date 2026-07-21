import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  type NameChangeFormData,
  nameChangeFormDataSchema,
} from '@/user/interface/ui/name-change-form.schema';
import { useUserNameEdit } from '@/user/presentation/ui/forms/name/use-name-edit';

const defaultNameFormValues: NameChangeFormData = {
  name: '',
};

export function useNameForm({ name }: { name: string | null | undefined }) {
  const { mutateAsync } = useUserNameEdit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, errors, isSubmitting, isSubmitSuccessful },
  } = useForm<NameChangeFormData>({
    resolver: zodResolver(nameChangeFormDataSchema),
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
