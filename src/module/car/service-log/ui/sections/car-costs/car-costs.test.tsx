import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { CarCostsSection } from '@/car/service-log/ui/sections/car-costs/car-costs';
import { getServiceLogsWithCostByCarId } from '@/lib/supabase/tables/service_logs';
import { SPINNER_TEST_ID } from '@/ui/decorative/spinner/spinner';

jest.mock('@/lib/supabase/tables/service_logs');
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: jest.fn() }),
}));

const mockGetServiceLogsWithCostByCarId =
  getServiceLogsWithCostByCarId as jest.MockedFunction<
    typeof getServiceLogsWithCostByCarId
  >;

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
    mockGetServiceLogsWithCostByCarId.mockReturnValue(new Promise(() => {}));

    render(<CarCostsSection carId="1" />, { wrapper: createWrapper() });

    expect(screen.getByRole('heading', { name: /costs/i })).toBeInTheDocument();
  });

  it('should render spinner while data is loading', () => {
    mockGetServiceLogsWithCostByCarId.mockReturnValue(new Promise(() => {}));

    render(<CarCostsSection carId="1" />, { wrapper: createWrapper() });

    expect(screen.getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
  });
});
