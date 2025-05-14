Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: jest.fn(() => `${Date.now()}-${Math.random()}`),
  },
});
