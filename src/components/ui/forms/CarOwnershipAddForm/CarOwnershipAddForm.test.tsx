import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/features/common/providers/TanStackQueryProvider';
import { addCarOwnershipByUserId } from '@/utils/supabase/tables/cars_ownerships';

import { CarOwnershipAddForm } from './CarOwnershipAddForm';

jest.mock('@/utils/supabase/tables/cars_ownerships', () => ({
  addCarOwnershipByUserId: jest.fn(),
}));

jest.mock('@/utils/tanstack/cars_ownerships', () => ({
  carsOwnershipsAddOnError: jest.fn(),
  carsOwnershipsAddOnMutate: jest.fn(),
}));

const MOCK_CAR_ID = 'e63b96e8-8643-4084-915f-2e0421dd68e5';
const MOCK_USER_ID = 'c9625093-4dec-4704-84c4-11268e54cd2c';

function TestCarOwnershipAddForm() {
  return (
    <TanStackQueryProvider>
      <CarOwnershipAddForm carId={MOCK_CAR_ID} />
    </TanStackQueryProvider>
  );
}

describe('CarOwnershipAddForm', () => {
  it('should render a user ID input', () => {
    render(<TestCarOwnershipAddForm />);

    const userIDInput = screen.getByRole('textbox', { name: /user id/i });

    expect(userIDInput).toBeInTheDocument();
  });

  it('should render a form reset button', () => {
    render(<TestCarOwnershipAddForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });

    expect(resetButton).toBeInTheDocument();
  });

  it('should render a form submit button', () => {
    render(<TestCarOwnershipAddForm />);

    const submitButton = screen.getByRole('button', { name: 'Save' });

    expect(submitButton).toBeInTheDocument();
  });

  it('initially form controls should be disabled', () => {
    render(<TestCarOwnershipAddForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const submitButton = screen.getByRole('button', { name: 'Save' });

    expect(resetButton).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('reset button should be enabled after user ID input change', async () => {
    const inputText = 'some input';
    const user = userEvent.setup();
    render(<TestCarOwnershipAddForm />);

    const userIDInput = screen.getByRole('textbox', { name: /user id/i });
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    await user.type(userIDInput, inputText);

    expect(resetButton).toBeEnabled();
  });

  it('submit button should be disabled while wrong input format is provided', async () => {
    const wrongFormatInput = 'wrong format';
    const user = userEvent.setup();
    render(<TestCarOwnershipAddForm />);

    const userIDInput = screen.getByRole('textbox', { name: /user id/i });
    const submitButton = screen.getByRole('button', { name: 'Save' });

    await user.type(userIDInput, wrongFormatInput);

    expect(submitButton).toBeDisabled();
  });

  it('submit button should be enabled while correct user ID is provided', async () => {
    const user = userEvent.setup();
    render(<TestCarOwnershipAddForm />);

    const userIDInput = screen.getByRole('textbox', { name: /user id/i });
    const submitButton = screen.getByRole('button', { name: 'Save' });

    await user.type(userIDInput, MOCK_USER_ID);

    expect(submitButton).toBeEnabled();
  });

  it('should call proper submit handler on submit', async () => {
    const user = userEvent.setup();
    render(<TestCarOwnershipAddForm />);

    const userIDInput = screen.getByRole('textbox', { name: /user id/i });
    const submitButton = screen.getByRole('button', { name: 'Save' });

    await user.type(userIDInput, MOCK_USER_ID);
    await user.click(submitButton);

    expect(addCarOwnershipByUserId).toHaveBeenCalledWith(
      MOCK_CAR_ID,
      MOCK_USER_ID,
    );
  });
});
