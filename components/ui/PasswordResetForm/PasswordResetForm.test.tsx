import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PasswordResetForm } from './PasswordResetForm';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: 'ok', error: null }),
  }),
) as jest.Mock;

describe('PasswordResetForm', () => {
  it('should render new password input field', () => {
    render(<PasswordResetForm />);

    const passwordInput = screen.getByLabelText(/new password/i);

    expect(passwordInput).toBeInTheDocument();
  });

  it('should render confirm password input field', () => {
    render(<PasswordResetForm />);

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    expect(confirmPasswordInput).toBeInTheDocument();
  });

  it('should be initially disabled', () => {
    render(<PasswordResetForm />);

    const submitButton = screen.getByRole('button', { name: /reset/i });

    expect(submitButton).toBeDisabled();
  });

  it('should be disabled if only new password input touched', async () => {
    const user = userEvent.setup();
    const correctPassword = 'correct';
    render(<PasswordResetForm />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const submitButton = screen.getByRole('button', { name: /reset/i });
    await user.type(passwordInput, correctPassword);

    expect(submitButton).toBeDisabled();
  });

  it('should be disabled if only confirm password input touched', async () => {
    const user = userEvent.setup();
    const correctPassword = 'correct';
    render(<PasswordResetForm />);

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset/i });
    await user.type(confirmPasswordInput, correctPassword);

    expect(submitButton).toBeDisabled();
  });

  it('should be disabled if one of the fields are incorrect', async () => {
    const user = userEvent.setup();
    const correctPassword = 'correct';
    const wrongPassword = 'wrong';
    render(<PasswordResetForm />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset/i });

    await user.type(passwordInput, correctPassword);
    await user.type(confirmPasswordInput, wrongPassword);

    expect(submitButton).toBeDisabled();

    await user.type(passwordInput, wrongPassword);
    await user.type(confirmPasswordInput, correctPassword);

    expect(submitButton).toBeDisabled();
  });

  it('should be disabled if two passwords are the same but incorrect', async () => {
    const user = userEvent.setup();
    const wrongPassword = 'wrong';
    render(<PasswordResetForm />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset/i });

    await user.type(passwordInput, wrongPassword);
    await user.type(confirmPasswordInput, wrongPassword);

    expect(submitButton).toBeDisabled();
  });

  it('should be disabled if two passwords are correct but not the same', async () => {
    const user = userEvent.setup();
    const correctPasswordOne = 'correctOne';
    const correctPasswordTwo = 'correctTwo';
    render(<PasswordResetForm />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset/i });

    await user.type(passwordInput, correctPasswordOne);
    await user.type(confirmPasswordInput, correctPasswordTwo);

    expect(submitButton).toBeDisabled();

    await user.type(passwordInput, correctPasswordTwo);
    await user.type(confirmPasswordInput, correctPasswordOne);

    expect(submitButton).toBeDisabled();
  });

  it('should be enabled if two passwords are the same and are correct', async () => {
    const user = userEvent.setup();
    const correctPassword = 'correct';
    render(<PasswordResetForm />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset/i });

    await user.type(passwordInput, correctPassword);
    await user.type(confirmPasswordInput, correctPassword);

    expect(submitButton).toBeEnabled();
  });

  it('should call submit handler on submit', async () => {
    const user = userEvent.setup();
    const correctPassword = 'correct';
    render(<PasswordResetForm />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset/i });

    await user.type(passwordInput, correctPassword);
    await user.type(confirmPasswordInput, correctPassword);
    await user.click(submitButton);
    await user.click(submitButton);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('should not call submit handler while disabled', async () => {
    const user = userEvent.setup();
    const correctPassword = 'correct';
    const wrongPassword = 'wrong';
    render(<PasswordResetForm />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /reset/i });

    await user.type(passwordInput, correctPassword);
    await user.type(confirmPasswordInput, wrongPassword);
    await user.click(submitButton);
    await user.click(submitButton);

    expect(fetch).toHaveBeenCalledTimes(0);
  });
});
