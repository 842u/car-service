const baseKey = 'service-log';

export const queryKeys = {
  all: () => [baseKey] as const,
  byCarId: (carId: string) => [...queryKeys.all(), 'car', carId] as const,
} as const;
