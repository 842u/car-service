const baseQueryKeys = {
  serviceLogs: 'service_logs' as const,
};

export const queryKeys = {
  serviceLogsWithCost: [baseQueryKeys.serviceLogs, 'withCost'] as const,
  serviceLogsWithCostByCarId: (carId: string) =>
    [baseQueryKeys.serviceLogs, 'withCost', carId] as const,
};
