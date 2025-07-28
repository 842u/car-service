import { render, screen } from '@testing-library/react';

import { HeroSection } from './HeroSection';

describe('HeroSection', () => {
  it('should render heading level 1', () => {
    render(<HeroSection />);

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });

  it('should render links for signing in and signing up pages', () => {
    const signInPagePath = '/dashboard/sign-in';
    const signUpPagePath = '/dashboard/sign-up';

    render(<HeroSection />);

    const signInLink = screen.getByRole('link', { name: /sign in/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });

    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', signInPagePath);
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', signUpPagePath);
  });
});
