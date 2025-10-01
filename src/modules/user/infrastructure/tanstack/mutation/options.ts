import type { QueryClient } from '@tanstack/react-query';
import { mutationOptions } from '@tanstack/react-query';

import type { NameChangeContract } from '@/user/interface/contracts/name-change.schema';
import { updateCurrentSessionProfile } from '@/utils/supabase/tables/profiles';
import { profilesUpdateOnMutate } from '@/utils/tanstack/profiles';

export const updateUserNameMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    throwOnError: false,
    mutationFn: (variables: NameChangeContract) =>
      updateCurrentSessionProfile({
        property: 'username',
        value: variables.name.trim(),
      }),
    onMutate: (variables) =>
      profilesUpdateOnMutate(
        queryClient,
        'session',
        'username',
        variables.name.trim(),
      ),
  });
