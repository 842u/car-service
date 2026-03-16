import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getSessionUserQueryOptions } from '@/user/infrastructure/tanstack/query/options';

export function useOverviewSection() {
  const { addToast } = useToasts();

  const { data, error, isError } = useQuery(getSessionUserQueryOptions);

  useEffect(() => {
    isError && addToast(error.message, 'error');
  }, [isError, addToast, error]);

  return { data };
}
