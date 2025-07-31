class MockIntersectionObserver implements IntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn();
  root: IntersectionObserver['root'] = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});
