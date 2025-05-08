jest.mock('next/navigation', () => ({
  useRouter: () => ({ router: {} }),
}));
