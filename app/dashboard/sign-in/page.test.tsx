import { render, screen } from '@testing-library/react';

import SignInPage from './page';

describe('SignInPage', () => {
  it('should render heading that indicates signing in', () => {
    render(<SignInPage />);

    const heading = screen.getByRole('heading', { name: /sign in/i });

    expect(heading).toBeInTheDocument();
  });

  it('should render form for signing in', () => {
    render(<SignInPage />);

    const form = screen.getByTestId('auth-form');
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    expect(form).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
  });

  it('should render link for sign up page', () => {
    render(<SignInPage />);

    const link = screen.getByRole('link', { name: /sign up/i });

    expect(link).toBeInTheDocument();
  });
});
