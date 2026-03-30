import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createMockServiceLog } from '@/lib/jest/mock/src/module/car/service-log';
import { parseDateToYyyyMmDd } from '@/lib/utils';

import {
  CustomPeriodCostsSummary,
  FILTERED_COSTS_TEST_ID,
} from './custom-period';

const MOCK_TODAY = new Date('2026-03-19');
const MOCK_FIRST_DAY_OF_MONTH = new Date(
  MOCK_TODAY.getFullYear(),
  MOCK_TODAY.getMonth(),
  1,
);

const TODAY_STR = parseDateToYyyyMmDd(MOCK_TODAY);
const FIRST_DAY_OF_MONTH_STR = parseDateToYyyyMmDd(MOCK_FIRST_DAY_OF_MONTH);

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(MOCK_TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('CustomPeriodCostsSummary', () => {
  describe('initial render', () => {
    it('should render from date input with first day of month as default', () => {
      render(<CustomPeriodCostsSummary />);

      expect(screen.getByLabelText(/from/i)).toHaveValue(
        FIRST_DAY_OF_MONTH_STR,
      );
    });

    it('should render to date input with today as default', () => {
      render(<CustomPeriodCostsSummary />);

      expect(screen.getByLabelText(/to/i)).toHaveValue(TODAY_STR);
    });

    it('should render 0 when no service logs provided', () => {
      render(<CustomPeriodCostsSummary />);

      expect(screen.getByTestId(FILTERED_COSTS_TEST_ID)).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('date inputs', () => {
    it('should update fromDate input when user changes it', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<CustomPeriodCostsSummary serviceLogs={[]} />);

      await user.clear(screen.getByLabelText(/from/i));
      await user.type(screen.getByLabelText(/from/i), '2026-01-01');

      expect(screen.getByLabelText(/from/i)).toHaveValue('2026-01-01');
    });

    it('should update toDate input when user changes it', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<CustomPeriodCostsSummary serviceLogs={[]} />);

      await user.clear(screen.getByLabelText(/to/i));
      await user.type(screen.getByLabelText(/to/i), '2026-12-31');

      expect(screen.getByLabelText(/to/i)).toHaveValue('2026-12-31');
    });
  });

  describe('costs display', () => {
    it('should display costs for logs within the default period', () => {
      const logs = [
        createMockServiceLog({ service_cost: 200, service_date: '2026-03-10' }),
        createMockServiceLog({ service_cost: 999, service_date: '2026-02-01' }),
      ];

      render(<CustomPeriodCostsSummary serviceLogs={logs} />);

      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('should recalculate costs when fromDate changes', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const logs = [
        createMockServiceLog({ service_cost: 100, service_date: '2026-02-01' }),
        createMockServiceLog({ service_cost: 200, service_date: '2026-03-10' }),
      ];

      render(<CustomPeriodCostsSummary serviceLogs={logs} />);

      expect(screen.getByText('200')).toBeInTheDocument();

      await user.clear(screen.getByLabelText(/from/i));
      await user.type(screen.getByLabelText(/from/i), '2026-02-01');

      expect(screen.getByText('300')).toBeInTheDocument();
    });
  });
});
