Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: jest.fn(
      () =>
        `12345678-${Math.floor(Math.random() * 10000)}-4234-${Math.floor(Math.random() * 10000)}-123456789012`,
    ),
  },
});
