const baseQueryKeys = {
  cars: 'cars' as const,
  carsOwnerships: 'cars_ownerships' as const,
  serviceLogs: 'service_logs' as const,
};

export const queryKeys = {
  carsInfinite: [baseQueryKeys.cars, 'infinite'] as const,
  carsInfiniteByColumnOrder: (column: string) =>
    [baseQueryKeys.cars, 'infinite', column] as const,

  cars: [baseQueryKeys.cars] as const,
  carsByCarId: (id: string) => [baseQueryKeys.cars, id] as const,

  carsOwnerships: [baseQueryKeys.carsOwnerships] as const,
  carsOwnershipsByCarId: (carId: string) =>
    [baseQueryKeys.carsOwnerships, carId] as const,
  carsOwnershipsByOwnerId: (ownerId: string) => [
    baseQueryKeys.carsOwnerships,
    ownerId,
  ],

  serviceLogsByCarId: (carId: string) =>
    [baseQueryKeys.serviceLogs, carId] as const,
};
