import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { getServiceLogsWithCost } from '@/lib/supabase/tables/service_logs';
import { SPINNER_TEST_ID } from '@/ui/decorative/spinner/spinner';

import { CostsSection } from './costs';

jest.mock('@/lib/supabase/tables/service_logs');
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: jest.fn() }),
}));

const mockGetServiceLogsWithCost =
  getServiceLogsWithCost as jest.MockedFunction<typeof getServiceLogsWithCost>;

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

describe('CostsSection', () => {
  it('should render the Costs heading', () => {
    mockGetServiceLogsWithCost.mockReturnValue(new Promise(() => {}));

    render(<CostsSection />, { wrapper: createWrapper() });

    expect(screen.getByRole('heading', { name: /costs/i })).toBeInTheDocument();
  });

  it('should render spinner while data is loading', () => {
    mockGetServiceLogsWithCost.mockReturnValue(new Promise(() => {}));

    render(<CostsSection />, { wrapper: createWrapper() });

    expect(screen.getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
  });
});
