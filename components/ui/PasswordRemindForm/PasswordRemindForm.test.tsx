import { createBrowserClient } from '@supabase/ssr';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { correctEmails, wrongEmails } from '@/utils/validation';

import { PasswordRemindForm } from './PasswordRemindForm';

jest.setTimeout(12000);

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: { resetPasswordForEmail: () => ({ data: {}, error: null }) },
  })),
}));

describe('PasswordRemindForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render an email input field', () => {
    render(<PasswordRemindForm />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });

    expect(emailInput).toBeInTheDocument();
  });

  it('should render a button to send reset password email', () => {
    render(<PasswordRemindForm />);

    const submitButton = screen.getByRole('button', {
      name: /send password reset email/i,
    });

    expect(submitButton).toBeInTheDocument();
  });

  it('should be disabled while not touched', () => {
    render(<PasswordRemindForm />);

    const submitButton = screen.getByRole('button', {
      name: /send password reset email/i,
    });

    expect(submitButton).toBeDisabled();
  });

  it('submit handler should not be called while wrong email provided', async () => {
    const wrongEmail = wrongEmails[0];
    const user = userEvent.setup();
    render(<PasswordRemindForm />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', {
      name: /send password reset email/i,
    });
    await user.type(emailInput, wrongEmail);
    await user.click(submitButton);
    await user.click(submitButton);

    expect(createBrowserClient).not.toHaveBeenCalled();
  });

  it('submit handler should be called while correct email provided', async () => {
    const correctEmail = correctEmails[0];
    const user = userEvent.setup();
    render(<PasswordRemindForm />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', {
      name: /send password reset email/i,
    });
    await user.type(emailInput, correctEmail);
    await user.click(submitButton);
    await user.click(submitButton);

    expect(createBrowserClient).toHaveBeenCalledTimes(1);
  });

  it('should be disabled while wrong email format provided', async () => {
    const user = userEvent.setup();
    const wrongEmail = wrongEmails[0];
    render(<PasswordRemindForm />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', {
      name: /send password reset email/i,
    });
    await user.type(emailInput, wrongEmail);

    expect(submitButton).toBeDisabled();
  });

  it('should be enabled while correct email format provided', async () => {
    const user = userEvent.setup();
    const correctEmail = correctEmails[0];
    render(<PasswordRemindForm />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', {
      name: /send password reset email/i,
    });

    await user.type(emailInput, correctEmail);

    expect(submitButton).toBeEnabled();
  });
});
