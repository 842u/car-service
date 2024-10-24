import { render, screen } from '@testing-library/react';

import EmailAuthForm, { EmailAuthFormType } from './EmailAuthForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({}),
}));

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: () => ({}),
}));

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
});
