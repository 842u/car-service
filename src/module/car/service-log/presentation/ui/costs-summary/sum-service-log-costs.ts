import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';

interface ServiceLogCostRange {
  from: string;
  to: string;
}

function hasServiceCost(
  serviceLog: ServiceLogDto,
): serviceLog is ServiceLogDto & { serviceCost: number } {
  return serviceLog.serviceCost != null;
}

export function sumServiceLogCosts(
  serviceLogs: ServiceLogDto[],
  range?: ServiceLogCostRange,
) {
  return serviceLogs
    .filter(hasServiceCost)
    .filter(
      (serviceLog) =>
        !range ||
        (serviceLog.serviceDate >= range.from &&
          serviceLog.serviceDate <= range.to),
    )
    .reduce((sum, serviceLog) => sum + serviceLog.serviceCost, 0);
}
