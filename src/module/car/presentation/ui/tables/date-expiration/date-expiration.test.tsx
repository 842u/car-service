import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import { buildCarDto } from '@/car/application/dto/car.builder';
import { carDataSource } from '@/car/dependency/data-source';
import { SPINNER_TEST_ID } from '@/ui/decorative/spinner/spinner';

import { DateExpirationTable } from './date-expiration';

const mockCarDataSource = carDataSource as jest.Mocked<typeof carDataSource>;
jest.mock('@/car/dependency/data-source');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

jest.mock('@/car/presentation/ui/badge/badge', () => ({
  CarBadge: () => null,
}));
jest.mock(
  '@/car/presentation/ui/tables/date-expiration/view-button/view-button',
  () => ({
    DateExpirationTableViewButton: () => null,
  }),
);
jest.mock(
  '@/ui/date-expiration-status-icon/date-expiration-status-icon',
  () => ({
    DateExpirationStatusIcon: () => null,
  }),
);
jest.mock('@/car/presentation/ui/tables/date-expiration/legend/legend', () => ({
  DateExpirationTableLegend: () => null,
}));

const MOCK_CARS = [buildCarDto(), buildCarDto()];
const DEFAULT_PROPS = {
  label: 'Insurance',
  dateColumn: 'insuranceExpiration' as const,
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
    mockCarDataSource.getByPage.mockReturnValue(new Promise(() => {}));

    render(<DateExpirationTable {...DEFAULT_PROPS} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
  });

  it('should not render spinner after data loads', async () => {
    mockCarDataSource.getByPage.mockResolvedValue({
      success: true,
      data: { data: MOCK_CARS, nextPageParam: null },
    });

    render(<DateExpirationTable {...DEFAULT_PROPS} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(screen.queryByTestId(SPINNER_TEST_ID)).not.toBeInTheDocument(),
    );
  });

  it('should render table after data loads', async () => {
    mockCarDataSource.getByPage.mockResolvedValue({
      success: true,
      data: { data: MOCK_CARS, nextPageParam: null },
    });

    render(<DateExpirationTable {...DEFAULT_PROPS} />, {
      wrapper: createWrapper(),
    });

    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('should render placeholder if there is no data', async () => {
    mockCarDataSource.getByPage.mockResolvedValue({
      success: true,
      data: { data: [], nextPageParam: null },
    });

    render(<DateExpirationTable {...DEFAULT_PROPS} />, {
      wrapper: createWrapper(),
    });

    expect(
      await screen.findByText(
        `No ${DEFAULT_PROPS.label.toLowerCase()} expiration data yet`,
      ),
    ).toBeInTheDocument();
  });
});
