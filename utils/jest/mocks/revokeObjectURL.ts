Object.defineProperty(window.URL, 'revokeObjectURL', {
  configurable: true,
  writable: true,
  value: jest.fn(),
});
