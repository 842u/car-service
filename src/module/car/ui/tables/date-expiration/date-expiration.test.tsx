import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { createMockCar } from '@/lib/jest/mock/src/module/car/car';
import { getCarsByPage } from '@/lib/supabase/tables/cars';
import { SPINNER_TEST_ID } from '@/ui/decorative/spinner/spinner';

import { DateExpirationTable } from './date-expiration';

const mockGetCarsByPage = getCarsByPage as jest.MockedFunction<
  typeof getCarsByPage
>;
jest.mock('@/lib/supabase/tables/cars');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

jest.mock('@/car/ui/badge/badge', () => ({
  CarBadge: () => null,
}));
jest.mock('@/car/ui/tables/date-expiration/view-button/view-button', () => ({
  DateExpirationTableViewButton: () => null,
}));
jest.mock(
  '@/ui/date-expiration-status-icon/date-expiration-status-icon',
  () => ({
    DateExpirationStatusIcon: () => null,
  }),
);
jest.mock('@/car/ui/tables/date-expiration/legend/legend', () => ({
  DateExpirationTableLegend: () => null,
}));

const MOCK_CARS = [createMockCar(), createMockCar()];
const DEFAULT_PROPS = {
  label: 'Insurance',
  dateColumn: 'insurance_expiration' as const,
};

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

describe('DateExpirationTable', () => {
  it('should render spinner while pending', () => {
    mockGetCarsByPage.mockReturnValue(new Promise(() => {}));

    render(<DateExpirationTable {...DEFAULT_PROPS} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
  });

  it('should not render spinner after data loads', async () => {
    mockGetCarsByPage.mockResolvedValue({
      data: MOCK_CARS,
      nextPageParam: null,
    });

    render(<DateExpirationTable {...DEFAULT_PROPS} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(screen.queryByTestId(SPINNER_TEST_ID)).not.toBeInTheDocument(),
    );
  });

  it('should render table after data loads', async () => {
    mockGetCarsByPage.mockResolvedValue({
      data: MOCK_CARS,
      nextPageParam: null,
    });

    render(<DateExpirationTable {...DEFAULT_PROPS} />, {
      wrapper: createWrapper(),
    });

    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('should render table with empty data', async () => {
    mockGetCarsByPage.mockResolvedValue({ data: [], nextPageParam: null });

    render(<DateExpirationTable {...DEFAULT_PROPS} />, {
      wrapper: createWrapper(),
    });

    expect(await screen.findByRole('table')).toBeInTheDocument();
  });
});
