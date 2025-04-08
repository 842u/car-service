const baseQueryKeys = {
  cars: 'cars' as const,
  profiles: 'profiles' as const,
  carsOwnerships: 'cars_ownerships' as const,
};

export const queryKeys = {
  infiniteCars: ['infinite', baseQueryKeys.cars] as const,

  cars: [baseQueryKeys.cars] as const,
  carsByCarId: (id: string) => [baseQueryKeys.cars, id] as const,

  profiles: [baseQueryKeys.profiles] as const,
  profilesCurrentSession: [baseQueryKeys.profiles, 'session'] as const,
  profilesByUserId: (userId: string) =>
    [baseQueryKeys.profiles, userId] as const,

  carsOwnerships: [baseQueryKeys.carsOwnerships] as const,
  carsOwnershipsByCarId: (carId: string) =>
    [baseQueryKeys.profiles, carId] as const,
};
