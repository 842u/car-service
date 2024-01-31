import { render, screen } from '@testing-library/react';

import SignUpPage from './page';

describe('SignUpPage', () => {
  it('should render heading that indicates account creation', () => {
    render(<SignUpPage />);

    const heading = screen.getByRole('heading', { name: /new account/i });

    expect(heading).toBeInTheDocument();
  });

  it('should render form for signing up', () => {
    render(<SignUpPage />);

    const form = screen.getByTestId('auth-form');
    const signUpText = screen.getByText(/sign up/i);

    expect(form).toBeInTheDocument();
    expect(signUpText).toBeInTheDocument();
  });

  it('should render link for sign in page', () => {
    render(<SignUpPage />);

    const link = screen.getByRole('link', { name: /sign in/i });

    expect(link).toBeInTheDocument();
  });
});
