import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ownershipApiClient } from '@/car/ownership/dependency/api-client';
import { TanStackQueryProvider } from '@/common/presentation/provider/tan-stack-query';

import { AddForm } from './add';

jest.mock('@/car/ownership/dependency/api-client', () => ({
  ownershipApiClient: {
    add: jest.fn(),
  },
}));

const MOCK_CAR_ID = 'e63b96e8-8643-4084-915f-2e0421dd68e5';
const MOCK_OWNER_ID = 'c9625093-4dec-4704-84c4-11268e54cd2c';

function TestAddForm() {
  return (
    <TanStackQueryProvider>
      <AddForm carId={MOCK_CAR_ID} />
    </TanStackQueryProvider>
  );
}

describe('AddForm', () => {
  it('should render an owner ID input', () => {
    render(<TestAddForm />);

    const ownerIdInput = screen.getByRole('textbox', { name: /owner id/i });

    expect(ownerIdInput).toBeInTheDocument();
  });

  it('should render a form reset button', () => {
    render(<TestAddForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });

    expect(resetButton).toBeInTheDocument();
  });

  it('should render a form submit button', () => {
    render(<TestAddForm />);

    const submitButton = screen.getByRole('button', { name: 'Save' });

    expect(submitButton).toBeInTheDocument();
  });

  it('initially form controls should be disabled', () => {
    render(<TestAddForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const submitButton = screen.getByRole('button', { name: 'Save' });

    expect(resetButton).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('reset button should be enabled after owner ID input change', async () => {
    const inputText = 'some input';
    const user = userEvent.setup();
    render(<TestAddForm />);

    const ownerIdInput = screen.getByRole('textbox', { name: /owner id/i });
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    await user.type(ownerIdInput, inputText);

    expect(resetButton).toBeEnabled();
  });

  it('submit button should be disabled while wrong input format is provided', async () => {
    const wrongFormatInput = 'wrong format';
    const user = userEvent.setup();
    render(<TestAddForm />);

    const ownerIdInput = screen.getByRole('textbox', { name: /owner id/i });
    const submitButton = screen.getByRole('button', { name: 'Save' });

    await user.type(ownerIdInput, wrongFormatInput);

    expect(submitButton).toBeDisabled();
  });

  it('submit button should be enabled while correct owner ID is provided', async () => {
    const user = userEvent.setup();
    render(<TestAddForm />);

    const ownerIdInput = screen.getByRole('textbox', { name: /owner id/i });
    const submitButton = screen.getByRole('button', { name: 'Save' });

    await user.type(ownerIdInput, MOCK_OWNER_ID);

    expect(submitButton).toBeEnabled();
  });

  it('should call the ownership api client on submit', async () => {
    jest.mocked(ownershipApiClient.add).mockResolvedValue({
      success: true,
      data: [],
    });

    const user = userEvent.setup();
    render(<TestAddForm />);

    const ownerIdInput = screen.getByRole('textbox', { name: /owner id/i });
    const submitButton = screen.getByRole('button', { name: 'Save' });

    await user.type(ownerIdInput, MOCK_OWNER_ID);
    await user.click(submitButton);

    expect(ownershipApiClient.add).toHaveBeenCalledWith({
      carId: MOCK_CAR_ID,
      ownerId: MOCK_OWNER_ID,
    });
  });
});
