import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ToastsProvider } from '@/features/common/providers/ToastsProvider';
import { SPINNER_TEST_ID } from '@/features/common/ui/decorative/Spinner/Spinner';

import { Toaster } from '../../Toaster/Toaster';
import EmailAuthForm, { EmailAuthFormType } from './EmailAuthForm';

const mockFetch = jest.fn();
window.fetch = mockFetch;

describe('EmailAuthForm', () => {
  it('should render email authentication form', () => {
    render(<EmailAuthForm type="sign-in" />);

    const form = screen.getByRole('form', { name: /email auth/i });

    expect(form).toBeInTheDocument();
  });

  it('should render email input field', () => {
    render(<EmailAuthForm type="sign-in" />);

    const emailInput = screen.getByRole('textbox', { name: /email/i });

    expect(emailInput).toBeInTheDocument();
  });

  it('should render password input field', () => {
    render(<EmailAuthForm type="sign-in" />);

    const passwordInput = screen.getByLabelText(/password/i);

    expect(passwordInput).toBeInTheDocument();
  });

  it('should render a submit button', () => {
    render(<EmailAuthForm type="sign-in" />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should render form of proper type', () => {
    const formTypes: EmailAuthFormType[] = ['sign-in', 'sign-up'];

    formTypes.forEach((type) => {
      render(<EmailAuthForm type={type} />);
      const formType = type.replace('-', ' ');

      const text = screen.getByText(formType, { exact: false });

      expect(text).toBeInTheDocument();
    });
  });

  it('should have submit button initially disabled', () => {
    render(<EmailAuthForm type="sign-up" />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });

    expect(submitButton).toBeDisabled();
  });

  it('should have submit button disabled if email or password are wrong', async () => {
    const user = userEvent.setup();
    const correctEmail = 'john.doe@example.com';
    const correctPassword = 'password';
    const wrongEmail = 'asd';
    const wrongPassword = 'asd';
    render(<EmailAuthForm type="sign-up" />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, correctEmail);
    await user.type(passwordInput, wrongPassword);
    await user.clear(emailInput);
    await user.clear(passwordInput);

    expect(submitButton).toBeDisabled();

    await user.type(emailInput, wrongEmail);
    await user.type(passwordInput, correctPassword);
    await user.clear(emailInput);
    await user.clear(passwordInput);

    expect(submitButton).toBeDisabled();

    await user.type(emailInput, wrongEmail);
    await user.type(passwordInput, wrongPassword);
    await user.clear(emailInput);
    await user.clear(passwordInput);

    expect(submitButton).toBeDisabled();
  });

  it('should have submit button enabled if email and password are correct', async () => {
    const user = userEvent.setup();
    const correctEmail = 'john.doe@example.com';
    const correctPassword = 'password';
    render(<EmailAuthForm type="sign-up" />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, correctEmail);
    await user.type(passwordInput, correctPassword);

    expect(submitButton).toBeEnabled();
  });

  it('should disable submit button and display loading spinner on submit', async () => {
    const user = userEvent.setup();
    const correctEmail = 'john.doe@example.com';
    const correctPassword = 'password';
    mockFetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'data', error: null }),
              }),
            50,
          );
        }),
    );
    render(<EmailAuthForm type="sign-up" />);

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, correctEmail);
    await user.type(passwordInput, correctPassword);
    await user.click(submitButton);

    const loadingSpinner = await screen.findByTestId(SPINNER_TEST_ID);

    expect(submitButton).toBeDisabled();
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('should display success info on successful submit', async () => {
    const user = userEvent.setup();
    const correctEmail = 'john.doe@example.com';
    const correctPassword = 'password';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        data: { id: 'some id' },
        error: null,
      }),
    });
    render(
      <ToastsProvider>
        <Toaster />
        <EmailAuthForm type="sign-up" />
      </ToastsProvider>,
    );

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, correctEmail);
    await user.type(passwordInput, correctPassword);
    await user.click(submitButton);

    const successToast = screen.getByRole('listitem', {
      name: /success notification: /i,
    });

    expect(successToast).toBeInTheDocument();
  });

  it('should display error info on unsuccessful submit', async () => {
    const user = userEvent.setup();
    const correctEmail = 'john.doe@example.com';
    const correctPassword = 'password';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValueOnce({ data: null, error: 'submit error' }),
    });
    render(
      <ToastsProvider>
        <Toaster />
        <EmailAuthForm type="sign-up" />
      </ToastsProvider>,
    );

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, correctEmail);
    await user.type(passwordInput, correctPassword);
    await user.click(submitButton);

    const errorToast = screen.getByRole('listitem', {
      name: /error notification: /i,
    });

    expect(errorToast).toBeInTheDocument();
  });
});
