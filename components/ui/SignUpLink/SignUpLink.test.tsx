import { render, screen } from '@testing-library/react';
import { Route } from 'next';

import { SignUpLink } from './SignUpLink';

describe('SignUpLink', () => {
  it('should render link to sign up page', () => {
    const signUpPagePath: Route = '/dashboard/sign-up';

    render(<SignUpLink />);

    const link = screen.getByRole('link', { name: /sign up/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', signUpPagePath);
  });
});
