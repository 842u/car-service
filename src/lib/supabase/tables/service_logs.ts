import { browserAuthClient } from '@/dependency/auth-client/browser';
import { browserDatabaseClient } from '@/dependency/database-client/browser';
import { toSafeNumber } from '@/lib/utils';
import type { ServiceLog } from '@/types';

export async function getServiceLogsByCarId(carId: string) {
  const queryResult = await browserDatabaseClient.query(async (from) =>
    from('service_logs')
      .select('*')
      .eq('car_id', carId)
      .order('service_date', { ascending: false })
      .order('created_at', { ascending: false }),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  return queryResult.data;
}

export async function getServiceLogsWithCost() {
  const queryResult = await browserDatabaseClient.query(async (from) =>
    from('service_logs')
      .select('*')
      .not('service_cost', 'is', null)
      .order('service_date', { ascending: false })
      .order('created_at', { ascending: false }),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  return queryResult.data;
}

export async function getServiceLogsWithCostByCarId(carId: string) {
  const queryResult = await browserDatabaseClient.query(async (from) =>
    from('service_logs')
      .select('*')
      .not('service_cost', 'is', null)
      .eq('car_id', carId)
      .order('service_date', { ascending: false })
      .order('created_at', { ascending: false }),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  return queryResult.data;
}

export async function deleteServiceLogById(id: string) {
  const sessionResult = await browserAuthClient.authenticate();

  if (!sessionResult.success) {
    const { message } = sessionResult.error;
    throw new Error(message);
  }

  const queryResult = await browserDatabaseClient.query(async (from) =>
    from('service_logs').delete().eq('id', id).select('id').single(),
  );

  if (!queryResult.success) {
    const { message } = queryResult.error;
    throw new Error(message);
  }

  return queryResult.data;
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
