import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { serviceLogApiClient } from '@/car/service-log/dependency/api-client';
import { TanStackQueryProvider } from '@/common/presentation/provider/tan-stack-query';

import { EditForm } from './edit';

jest.mock('@/car/service-log/dependency/api-client', () => ({
  serviceLogApiClient: {
    edit: jest.fn(),
  },
}));

const MOCK_SERVICE_LOG: ServiceLogDto = {
  id: '11111111-1111-4111-8111-111111111111',
  carId: 'e63b96e8-8643-4084-915f-2e0421dd68e5',
  authorId: 'b5b55395-e32f-4376-be03-f66be0a63ec4',
  serviceDate: '2026-01-01',
  categories: ['engine'],
  mileage: 50000,
  notes: 'Oil change',
  serviceCost: 100,
  createdAt: null,
};

function TestEditForm() {
  return (
    <TanStackQueryProvider>
      <EditForm serviceLog={MOCK_SERVICE_LOG} />
    </TanStackQueryProvider>
  );
}

describe('EditForm', () => {
  it('should render the service log fields prefilled from the service log', () => {
    render(<TestEditForm />);

    expect(screen.getByLabelText(/date/i)).toHaveValue('2026-01-01');
    expect(screen.getByLabelText(/mileage/i)).toHaveValue(50000);
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Oil change');
    expect(screen.getByLabelText(/cost/i)).toHaveValue(100);
    expect(screen.getByRole('checkbox', { name: /engine/i })).toBeChecked();
  });

  it('should render a form reset button', () => {
    render(<TestEditForm />);

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('should render a form submit button', () => {
    render(<TestEditForm />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('initially form controls should be disabled', () => {
    render(<TestEditForm />);

    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('enables submit once a field changes', async () => {
    const user = userEvent.setup();
    render(<TestEditForm />);

    await user.clear(screen.getByLabelText(/mileage/i));
    await user.type(screen.getByLabelText(/mileage/i), '60000');

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('calls the service log api client with the serviceLogId on submit', async () => {
    jest.mocked(serviceLogApiClient.edit).mockResolvedValue({
      success: true,
      data: { ...MOCK_SERVICE_LOG, mileage: 60000 },
    });

    const user = userEvent.setup();
    render(<TestEditForm />);

    await user.clear(screen.getByLabelText(/mileage/i));
    await user.type(screen.getByLabelText(/mileage/i), '60000');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(serviceLogApiClient.edit).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceLogId: MOCK_SERVICE_LOG.id,
        serviceDate: MOCK_SERVICE_LOG.serviceDate,
        categories: MOCK_SERVICE_LOG.categories,
        mileage: 60000,
      }),
    );
  });
});
