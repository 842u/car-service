import { render, screen } from '@testing-library/react';
import type { Route } from 'next';

import { SignOutButton } from './sign-out';

describe('SingOutButton', () => {
  it('should render a sign out link', () => {
    render(<SignOutButton />);

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toBeInTheDocument();
  });

  it('should have proper api endpoint', () => {
    const signOutApiEndpoint = '/api/auth/sign-out' satisfies Route;
    render(<SignOutButton />);

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toHaveAttribute('href', signOutApiEndpoint);
  });
});
