import { render, screen } from '@testing-library/react';
import { Route } from 'next';

import { SignOutLink } from './SignOutLink';

describe('SingOutLink', () => {
  it('should render a sign out link', () => {
    render(<SignOutLink />);

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toBeInTheDocument();
  });

  it('should have proper api endpoint', () => {
    const signOutApiEndpoint = '/api/auth/sign-out' satisfies Route;
    render(<SignOutLink />);

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toHaveAttribute('href', signOutApiEndpoint);
  });
});
