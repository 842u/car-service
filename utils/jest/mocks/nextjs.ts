jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({})),
}));
