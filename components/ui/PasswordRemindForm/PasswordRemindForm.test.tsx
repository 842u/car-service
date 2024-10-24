import { createBrowserClient } from '@supabase/ssr';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
    const wrongEmail = 'plainaddress';
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
    const correctEmail = 'username123@gmail.com';
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
    const wrongEmails = [
      'plainaddress',
      '@missingusername.com',
      'username@.com',
      'username@domain..com',
      'username@domain.c',
      'username@domain,com',
      'username@domain@domain.com',
      'username@-domain.com',
      'username@domain.com.',
      'username@domain.c#om',
      'username@domain..com',
      'username@.com',
      '@domain.com',
      'username@domain..com',
      'username@domain,com',
      'username@domain..com',
      'user name@domain.com',
      'username@domain.c@om',
      'username@domain..com',
      'username@domain.c#om',
      'username@domain..com',
    ];
    render(<PasswordRemindForm />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', {
      name: /send password reset email/i,
    });

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const email of wrongEmails) {
      await user.clear(emailInput);
      await user.type(emailInput, email);

      expect(submitButton).toBeDisabled();
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
  });

  it('should be enabled while correct email format provided', async () => {
    const user = userEvent.setup();
    const correctEmails = [
      'john.doe@example.com',
      'jane_smith123@mail.org',
      'firstname.lastname@company.co',
      'contact@domain.co.uk',
      'username123@gmail.com',
      'name@domain123.com',
      'info@mywebsite.org',
      'support@service.com',
      'user.name@web-service.net',
      'admin@site.com',
      'user@company.email',
      'name.last@domain.com',
      'user.name@education.edu',
      'my.email@subdomain.domain.com',
      'example_user@domain.info',
      'hello.world@domain.travel',
      'user@my-domain.com',
    ];
    render(<PasswordRemindForm />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const submitButton = screen.getByRole('button', {
      name: /send password reset email/i,
    });

    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    for (const email of correctEmails) {
      await user.type(emailInput, email);

      expect(submitButton).toBeEnabled();

      await user.clear(emailInput);
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
  });
});
