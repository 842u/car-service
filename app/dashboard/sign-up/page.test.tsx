import { render, screen } from '@testing-library/react';

import SignUpPage from './page';

describe('SignUpPage', () => {
  it('should render heading that indicates account creation', () => {
    render(<SignUpPage />);

    const heading = screen.getByRole('heading', {
      name: /(new|create) account/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it('should render OAuth providers section', () => {
    render(<SignUpPage />);

    const authProviders = screen.getByRole('region', {
      name: /oauth providers/i,
    });

    expect(authProviders).toBeInTheDocument();
  });

  it('should render email authentication form for signing up', () => {
    render(<SignUpPage />);

    const form = screen.getByRole('form', { name: /email authentication/i });
    const signUpButton = screen.getByRole('button', { name: /sign up/i });

    expect(form).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });

  it('should render link for sign in page', () => {
    const signInPagePath = '/dashboard/sign-in';

    render(<SignUpPage />);

    const link = screen.getByRole('link', { name: /sign in/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', signInPagePath);
  });
});
