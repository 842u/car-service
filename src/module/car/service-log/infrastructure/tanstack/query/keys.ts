const baseKey = 'service-log';

export const queryKeys = {
  serviceLogsByCarId: (carId: string) => [baseKey, 'car', carId] as const,
  serviceLogs: [baseKey, 'all'] as const,
} as const;
