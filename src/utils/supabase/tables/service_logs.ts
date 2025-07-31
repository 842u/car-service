import type { ServiceLog } from '@/types';
import { toSafeNumber } from '@/utils/general';

import { createClient } from '../client';

export async function getServiceLogsByCarId(carId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('service_logs')
    .select('*')
    .eq('car_id', carId)
    .order('service_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteServiceLogById(id: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  const { data, error: serviceLogError } = await supabase
    .from('service_logs')
    .delete()
    .eq('id', id)
    .select('id')
    .single();

  if (serviceLogError) throw new Error(serviceLogError.message);

  if (!data) throw new Error('No service log was deleted.');

  return data;
}

type AvailableServiceLogsSortCriteria = keyof Pick<
  ServiceLog,
  'created_at' | 'service_date' | 'service_cost'
>;

export function multiCriteriaServiceLogsSortComparator(
  firstLog: ServiceLog,
  secondLog: ServiceLog,
  criteria: {
    key: AvailableServiceLogsSortCriteria;
    order: 'ascending' | 'descending';
  }[],
) {
  for (const { key, order } of criteria) {
    let comparison = 0;

    const firstLogValue = firstLog[key];
    const secondLogValue = secondLog[key];

    switch (key) {
      case 'service_date':
      case 'created_at': {
        const firstLogDate = new Date(firstLogValue as string).getTime();
        const secondLogDate = new Date(secondLogValue as string).getTime();

        comparison = firstLogDate - secondLogDate;
        break;
      }
      case 'service_cost': {
        const firstLogCost = toSafeNumber(firstLogValue);
        const secondLogCost = toSafeNumber(secondLogValue);

        comparison = firstLogCost - secondLogCost;
        break;
      }
      default: {
        key satisfies never;
        comparison = 0;
        break;
      }
    }

    if (comparison !== 0) {
      return order === 'ascending' ? comparison : -comparison;
    }
  }
  return 0;
}
