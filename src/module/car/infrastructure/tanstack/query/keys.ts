const baseKey = 'cars';

export const queryKeys = {
  carsInfinite: [baseKey, 'infinite'] as const,
  carsInfiniteByColumnOrder: (column: string) =>
    [baseKey, 'infinite', column] as const,
  carsByCarId: (id: string) => [baseKey, id] as const,
} as const;
