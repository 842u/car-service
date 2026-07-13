import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import { TanStackQueryProvider } from '@/common/presentation/provider/tan-stack-query';

import { AddForm } from './add';

jest.mock('@/car/service-log/dependency/api-client', () => ({
  serviceLogApiClient: {
    add: jest.fn(),
  },
}));

jest.mock('@/user/presentation/hooks/use-session-user', () => ({
  useSessionUser: () => ({
    data: { id: 'b5b55395-e32f-4376-be03-f66be0a63ec4' },
    isPending: false,
  }),
}));

const MOCK_CAR_ID = 'e63b96e8-8643-4084-915f-2e0421dd68e5';

function TestAddForm() {
  return (
    <TanStackQueryProvider>
      <AddForm carId={MOCK_CAR_ID} />
    </TanStackQueryProvider>
  );
}

describe('AddForm', () => {
  it('should render the service log fields', () => {
    render(<TestAddForm />);

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mileage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cost/i)).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /category/i }),
    ).toBeInTheDocument();
  });

  it('should render a form reset button', () => {
    render(<TestAddForm />);

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('should render a form submit button', () => {
    render(<TestAddForm />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('initially form controls should be disabled', () => {
    render(<TestAddForm />);

    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('enables submit once the required fields are filled', async () => {
    const user = userEvent.setup();
    render(<TestAddForm />);

    await user.type(screen.getByLabelText(/date/i), '2026-01-01');
    await user.click(screen.getByRole('checkbox', { name: /engine/i }));

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('calls the service log api client on submit', async () => {
    jest.mocked(serviceLogApiClient.add).mockResolvedValue({
      success: true,
      data: {
        id: '11111111-1111-4111-8111-111111111111',
        carId: MOCK_CAR_ID,
        authorId: 'b5b55395-e32f-4376-be03-f66be0a63ec4',
        serviceDate: '2026-01-01',
        categories: ['engine'],
        mileage: null,
        notes: null,
        serviceCost: null,
        createdAt: null,
      },
    });

    const user = userEvent.setup();
    render(<TestAddForm />);

    await user.type(screen.getByLabelText(/date/i), '2026-01-01');
    await user.click(screen.getByRole('checkbox', { name: /engine/i }));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(serviceLogApiClient.add).toHaveBeenCalledWith(
      expect.objectContaining({
        carId: MOCK_CAR_ID,
        serviceDate: '2026-01-01',
        categories: ['engine'],
      }),
    );
  });
});
