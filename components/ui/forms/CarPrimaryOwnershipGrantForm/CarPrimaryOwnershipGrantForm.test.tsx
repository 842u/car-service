import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';
import { updateCarPrimaryOwnershipByUserId } from '@/utils/supabase/tables/cars_ownerships';

import { CarPrimaryOwnershipGrantForm } from './CarPrimaryOwnershipGrantForm';

jest.mock('@/utils/supabase/tables/cars_ownerships', () => ({
  updateCarPrimaryOwnershipByUserId: jest.fn(),
}));

jest.mock('@/utils/tanstack/cars_ownerships', () => ({
  carsOwnershipsUpdateOnMutate: jest.fn(),
  carsOwnershipsUpdateOnError: jest.fn(),
}));

const MOCK_CAR_ID = 'c97e14a8-f19a-48dd-a8ac-55b2f34b706a';
const MOCK_USER_ID = '797ac92c-e9b1-4ce4-b146-a62e8f2193a4';

function TestCarPrimaryOwnershipGrantForm() {
  return (
    <TanStackQueryProvider>
      <CarPrimaryOwnershipGrantForm carId={MOCK_CAR_ID} />
    </TanStackQueryProvider>
  );
}

describe('CarPrimaryOwnershipGrantForm', () => {
  it('should render warning info', () => {
    render(<TestCarPrimaryOwnershipGrantForm />);

    const warningInfo = screen.getByText(
      'Granting primary ownership to someone else will revoke your current primary ownership status and the privileges that come with it.',
    );

    expect(warningInfo).toBeInTheDocument();
  });

  it('should render a user ID input', () => {
    render(<TestCarPrimaryOwnershipGrantForm />);

    const userIDInput = screen.getByRole('textbox', { name: /user id/i });

    expect(userIDInput).toBeInTheDocument();
  });

  it('should render a form reset button', () => {
    render(<TestCarPrimaryOwnershipGrantForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });

    expect(resetButton).toBeInTheDocument();
  });

  it('should render a form submit button', () => {
    render(<TestCarPrimaryOwnershipGrantForm />);

    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(saveButton).toBeInTheDocument();
  });

  it('initially form controls should be disabled', () => {
    render(<TestCarPrimaryOwnershipGrantForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(resetButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
  });

  it('reset button should be enabled after user ID input change', async () => {
    const inputText = 'test';
    const user = userEvent.setup();
    render(<TestCarPrimaryOwnershipGrantForm />);

    const userIDInput = screen.getByRole('textbox', { name: /user id/i });
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    await user.type(userIDInput, inputText);

    expect(resetButton).toBeEnabled();
  });

  it('reset button should reset form on click', async () => {
    const inputText = 'test';
    const user = userEvent.setup();
    render(<TestCarPrimaryOwnershipGrantForm />);

    const userIDInput = screen.getByRole('textbox', {
      name: /user id/i,
    }) as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    await user.type(userIDInput, inputText);

    expect(userIDInput.value).toBe(inputText);

    await user.click(resetButton);

    expect(userIDInput.value).toBe('');
  });

  it('submit button should be disabled when wrong format input is provided', async () => {
    const wrongFormatInput = 'wrong';
    const user = userEvent.setup();
    render(<TestCarPrimaryOwnershipGrantForm />);

    const userIDInput = screen.getByRole('textbox', {
      name: /user id/i,
    }) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.type(userIDInput, wrongFormatInput);

    expect(saveButton).toBeDisabled();
  });

  it('submit button should be enabled when correct input is provided', async () => {
    const user = userEvent.setup();
    render(<TestCarPrimaryOwnershipGrantForm />);

    const userIDInput = screen.getByRole('textbox', {
      name: /user id/i,
    }) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.type(userIDInput, MOCK_USER_ID);

    expect(saveButton).toBeEnabled();
  });

  it('should call proper submit handler on submit', async () => {
    const user = userEvent.setup();
    render(<TestCarPrimaryOwnershipGrantForm />);

    const userIDInput = screen.getByRole('textbox', {
      name: /user id/i,
    }) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.type(userIDInput, MOCK_USER_ID);
    await user.click(saveButton);

    expect(updateCarPrimaryOwnershipByUserId).toHaveBeenCalledWith(
      MOCK_CAR_ID,
      MOCK_USER_ID,
    );
  });
});
