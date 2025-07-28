import { render, screen } from '@testing-library/react';

import { NavBar } from '@/features/landing/ui/nav-bar/nav-bar';

describe('NavBar', () => {
  it('should render a brand logo with a link to a home page', () => {
    render(<NavBar />);

    const landingPageLink = screen.getByRole('link', { name: /home/i });

    expect(landingPageLink).toBeInTheDocument();
  });

  it('should render a hamburger button to toggle nav menu', () => {
    render(<NavBar />);

    const hamburgerButton = screen.getByRole('button', {
      name: /toggle navigation menu/i,
    });

    expect(hamburgerButton).toBeInTheDocument();
  });

  it('should render a navigation menu', () => {
    render(<NavBar />);

    const landingNavMenu = screen.getByRole('navigation', {
      name: /landing navigation menu/i,
    });

    expect(landingNavMenu).toBeInTheDocument();
  });
});
