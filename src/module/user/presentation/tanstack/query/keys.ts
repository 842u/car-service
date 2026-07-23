const baseKey = 'user';

export const queryKeys = {
  all: () => [baseKey] as const,
  session: () => [...queryKeys.all(), 'session'] as const,
} as const;
