import { render, screen } from '@testing-library/react';
import { Route } from 'next';

import { SignInLink } from './sign-in-link';

describe('SignInLink', () => {
  it('should render link to sign in page', () => {
    const signInPagePath: Route = '/dashboard/sign-in';

    render(<SignInLink />);

    const link = screen.getByRole('link', { name: /sign in/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', signInPagePath);
  });
});
