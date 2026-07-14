import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { serviceLogDataSource } from '@/car/service-log/dependency/data-source';
import { CarCostsSection } from '@/car/service-log/presentation/ui/sections/car-costs/car-costs';
import { SPINNER_TEST_ID } from '@/ui/decorative/spinner/spinner';

const mockServiceLogDataSource = serviceLogDataSource as jest.Mocked<
  typeof serviceLogDataSource
>;
jest.mock('@/car/service-log/dependency/data-source');

jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: jest.fn() }),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return Wrapper;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CarCostsSection', () => {
  it('should render the Costs heading', () => {
    mockServiceLogDataSource.getByCarId.mockReturnValue(new Promise(() => {}));

    render(<CarCostsSection carId="1" />, { wrapper: createWrapper() });

    expect(screen.getByRole('heading', { name: /costs/i })).toBeInTheDocument();
  });

  it('should render spinner while data is loading', () => {
    mockServiceLogDataSource.getByCarId.mockReturnValue(new Promise(() => {}));

    render(<CarCostsSection carId="1" />, { wrapper: createWrapper() });

    expect(screen.getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
  });
});
