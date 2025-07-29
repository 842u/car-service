import { render, screen } from '@testing-library/react';
import { Route } from 'next';

import { SignOutLinkButton } from './sign-out-link-button';

describe('SingOutLinkButton', () => {
  it('should render a sign out link', () => {
    render(<SignOutLinkButton />);

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toBeInTheDocument();
  });

  it('should have proper api endpoint', () => {
    const signOutApiEndpoint = '/api/auth/sign-out' satisfies Route;
    render(<SignOutLinkButton />);

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toHaveAttribute('href', signOutApiEndpoint);
  });
});
