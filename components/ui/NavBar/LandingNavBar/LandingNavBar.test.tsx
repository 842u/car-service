import { render, screen } from '@testing-library/react';

import { LandingNavBar } from './LandingNavBar';

describe('LandingNavBar', () => {
  it('should render a brand logo with a link to a landing page', () => {
    render(<LandingNavBar />);

    const landingPageLink = screen.getByRole('link', { name: /landing page/i });

    expect(landingPageLink).toBeInTheDocument();
  });

  it('should render a hamburger button to toggle nav menu', () => {
    render(<LandingNavBar />);

    const hamburgerButton = screen.getByRole('button', {
      name: /toggle navigation menu/i,
    });

    expect(hamburgerButton).toBeInTheDocument();
  });

  it('should render a navigation menu', () => {
    render(<LandingNavBar />);

    const landingNavMenu = screen.getByRole('navigation', {
      name: /landing navigation menu/i,
    });

    expect(landingNavMenu).toBeInTheDocument();
  });
});
