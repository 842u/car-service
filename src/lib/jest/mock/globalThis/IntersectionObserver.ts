class MockIntersectionObserver implements IntersectionObserver {
  readonly root: IntersectionObserver['root'] = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(public callback: IntersectionObserverCallback) {}

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn();
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: jest
    .fn()
    .mockImplementation((callback) => new MockIntersectionObserver(callback)),
});
