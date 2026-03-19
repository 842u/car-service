import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

import { createMockServiceLog } from '@/lib/jest/mock/src/module/car/service-log';
import { getServiceLogsWithCost } from '@/lib/supabase/tables/service_logs';
import { SPINNER_TEST_ID } from '@/ui/decorative/spinner/spinner';

import {
  CostsSection,
  FILTERED_COSTS_TEST_ID,
  TOTAL_COSTS_TEST_ID,
  YEAR_TO_DATE_COSTS_TEST_ID,
} from './costs';

jest.mock('@/lib/supabase/tables/service_logs');

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const mockGetServiceLogsWithCost =
  getServiceLogsWithCost as jest.MockedFunction<typeof getServiceLogsWithCost>;

const MOCK_TODAY = new Date('2026-03-19');
const TODAY_STR = '2026-03-19';
const FIRST_DAY_OF_MONTH_STR = '2026-03-01';

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
  jest.useFakeTimers();
  jest.setSystemTime(MOCK_TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('CostsSection', () => {
  describe('loading state', () => {
    it('should render spinner while pending', () => {
      mockGetServiceLogsWithCost.mockReturnValue(new Promise(() => {}));

      render(<CostsSection />, { wrapper: createWrapper() });

      expect(screen.getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();
    });

    it('should render Costs heading while pending', () => {
      mockGetServiceLogsWithCost.mockReturnValue(new Promise(() => {}));

      render(<CostsSection />, { wrapper: createWrapper() });

      expect(
        screen.getByRole('heading', { name: /costs/i }),
      ).toBeInTheDocument();
    });

    it('should not render cost sections while pending', () => {
      mockGetServiceLogsWithCost.mockReturnValue(new Promise(() => {}));

      render(<CostsSection />, { wrapper: createWrapper() });

      expect(screen.queryByText('All time costs')).not.toBeInTheDocument();
      expect(screen.queryByText('Past year costs')).not.toBeInTheDocument();
      expect(screen.queryByText('Custom period')).not.toBeInTheDocument();
    });

    it('should not render spinner after data loads', async () => {
      mockGetServiceLogsWithCost.mockResolvedValue([]);

      render(<CostsSection />, { wrapper: createWrapper() });

      await waitFor(() =>
        expect(screen.queryByTestId(SPINNER_TEST_ID)).not.toBeInTheDocument(),
      );
    });
  });

  describe('loaded state', () => {
    it('should render all section headings', async () => {
      mockGetServiceLogsWithCost.mockResolvedValue([]);

      render(<CostsSection />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('All time costs')).toBeInTheDocument();
        expect(screen.getByText('Past year costs')).toBeInTheDocument();
        expect(screen.getByText('Custom period')).toBeInTheDocument();
        expect(screen.getByText('Period total costs')).toBeInTheDocument();
      });
    });

    it('should render 0 for all costs when no service logs exist', async () => {
      mockGetServiceLogsWithCost.mockResolvedValue([]);

      render(<CostsSection />, { wrapper: createWrapper() });

      await waitFor(() => {
        const zeros = screen.getAllByText('0');
        expect(zeros).toHaveLength(3);
      });
    });

    it('should render totalCost value', async () => {
      const totalCost = 350;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: totalCost,
          service_date: '2026-01-01',
        }),
      ]);

      render(<CostsSection />, { wrapper: createWrapper() });

      await waitFor(() =>
        expect(screen.getByTestId(TOTAL_COSTS_TEST_ID)).toHaveTextContent(
          String(totalCost),
        ),
      );
    });

    it('should render yearToDateCost value', async () => {
      const yearToDateCost = 150;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: yearToDateCost,
          service_date: '2026-01-01', // within past year
        }),
      ]);

      render(<CostsSection />, { wrapper: createWrapper() });

      await waitFor(() =>
        expect(
          screen.getByTestId(YEAR_TO_DATE_COSTS_TEST_ID),
        ).toHaveTextContent(String(yearToDateCost)),
      );
    });

    it('should render date inputs with correct initial values', async () => {
      mockGetServiceLogsWithCost.mockResolvedValue([]);

      render(<CostsSection />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByLabelText(/from/i)).toHaveValue(
          FIRST_DAY_OF_MONTH_STR,
        );
        expect(screen.getByLabelText(/to/i)).toHaveValue(TODAY_STR);
      });
    });
  });

  describe('date inputs', () => {
    it('should update fromDate input when user changes it', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const newFromDate = '2026-01-01';

      mockGetServiceLogsWithCost.mockResolvedValue([]);

      render(<CostsSection />, { wrapper: createWrapper() });

      expect(await screen.findByLabelText(/from/i)).toBeInTheDocument();

      await user.clear(screen.getByLabelText(/from/i));
      await user.type(screen.getByLabelText(/from/i), newFromDate);

      expect(screen.getByLabelText(/from/i)).toHaveValue(newFromDate);
    });

    it('should update toDate input when user changes it', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const newToDate = '2026-12-31';

      mockGetServiceLogsWithCost.mockResolvedValue([]);

      render(<CostsSection />, { wrapper: createWrapper() });

      expect(await screen.findByLabelText(/to/i)).toBeInTheDocument();

      await user.clear(screen.getByLabelText(/to/i));
      await user.type(screen.getByLabelText(/to/i), newToDate);

      expect(screen.getByLabelText(/to/i)).toHaveValue(newToDate);
    });

    it('should recalculate filteredCost when fromDate changes', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const withinCost = 200;
      const beforeMonthCost = 100;

      mockGetServiceLogsWithCost.mockResolvedValue([
        createMockServiceLog({
          service_cost: withinCost,
          service_date: '2026-03-10',
        }),
        createMockServiceLog({
          service_cost: beforeMonthCost,
          service_date: '2026-02-01',
        }),
      ]);

      render(<CostsSection />, { wrapper: createWrapper() });

      expect(
        await screen.findByTestId(FILTERED_COSTS_TEST_ID),
      ).toBeInTheDocument();

      await user.clear(screen.getByLabelText(/from/i));
      await user.type(screen.getByLabelText(/from/i), '2026-02-01');

      expect(
        await screen.findByTestId(FILTERED_COSTS_TEST_ID),
      ).toBeInTheDocument();
    });
  });
});
