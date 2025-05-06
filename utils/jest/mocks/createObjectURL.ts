Object.defineProperty(window.URL, 'createObjectURL', {
  configurable: true,
  writable: true,
  value: jest.fn().mockReturnValue('/relative/url'),
});
