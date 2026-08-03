const baseKey = 'user';

export const queryKeys = {
  all: () => [baseKey] as const,
  session: () => [...queryKeys.all(), 'session'] as const,
  byId: (id: string) => [...queryKeys.all(), id] as const,
} as const;
