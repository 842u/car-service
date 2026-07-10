const baseQueryKeys = {
  carsOwnerships: 'cars_ownerships' as const,
  serviceLogs: 'service_logs' as const,
};

export const queryKeys = {
  carsOwnerships: [baseQueryKeys.carsOwnerships] as const,
  carsOwnershipsByCarId: (carId: string) =>
    [baseQueryKeys.carsOwnerships, carId] as const,

  serviceLogsByCarId: (carId: string) =>
    [baseQueryKeys.serviceLogs, carId] as const,
  serviceLogsWithCost: [baseQueryKeys.serviceLogs, 'withCost'] as const,
  serviceLogsWithCostByCarId: (carId: string) =>
    [baseQueryKeys.serviceLogs, 'withCost', carId] as const,
};
