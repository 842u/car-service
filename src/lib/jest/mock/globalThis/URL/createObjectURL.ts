Object.defineProperty(globalThis.URL, 'createObjectURL', {
  configurable: true,
  writable: true,
  value: jest
    .fn()
    .mockReturnValue('blob:test/12345678-1234-4234-8234-123456789012'),
});
