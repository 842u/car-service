import { zodResolver } from '@hookform/resolvers/zod';
import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useToasts } from '@/common/presentation/hooks/use-toasts';
import {
  type NameChangeContract,
  nameChangeContractSchema,
} from '@/user/interface/contracts/name-change.schema';
import { updateCurrentSessionProfile } from '@/utils/supabase/tables/profiles';
import { queryKeys } from '@/utils/tanstack/keys';
import { profilesUpdateOnMutate } from '@/utils/tanstack/profiles';

type MutationVariables = {
  formData: NameChangeContract;
  queryClient: QueryClient;
};

const defaultNameFormValues: NameChangeContract = {
  name: '',
};

export function useNameForm({ name }: { name: string | null | undefined }) {
  const { addToast } = useToasts();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    throwOnError: false,
    mutationFn: ({ formData: { name } }: MutationVariables) =>
      updateCurrentSessionProfile({
        property: 'username',
        value: name.trim(),
      }),
    onMutate: ({ queryClient, formData: { name } }) =>
      profilesUpdateOnMutate(queryClient, 'session', 'username', name.trim()),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isDirty, errors, isSubmitSuccessful },
  } = useForm<NameChangeContract>({
    resolver: zodResolver(nameChangeContractSchema),
    mode: 'onChange',
    defaultValues: defaultNameFormValues,
  });

  const handleFormSubmit = handleSubmit(
    async (formData: NameChangeContract) => {
      mutate(
        { formData, queryClient },
        {
          onSuccess: () => {
            addToast('Name updated successfully.', 'success');
          },
          onError: (error, { queryClient }, context) => {
            addToast(error.message, 'error');

            queryClient.setQueryData(
              queryKeys.profilesCurrentSession,
              context?.previousQueryData,
            );
          },
          onSettled: (_, __, { queryClient }) =>
            queryClient.invalidateQueries({
              queryKey: queryKeys.profilesCurrentSession,
            }),
        },
      );
    },
  );

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
