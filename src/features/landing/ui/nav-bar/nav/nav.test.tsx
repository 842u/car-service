import { render, screen } from '@testing-library/react';

import { Nav } from './nav';

describe('Nav', () => {
  it('should render landing page navigation menu', () => {
    render(<Nav />);

    const landingNavigation = screen.getByRole('navigation', {
      name: /landing navigation menu/i,
    });

    expect(landingNavigation).toBeInTheDocument();
  });

  it('should render a link to the dashboard page', () => {
    render(<Nav />);

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });

    expect(dashboardLink).toBeInTheDocument();
  });

  it('should render a theme switch button', () => {
    render(<Nav />);

    const themeSwitchButton = screen.getByRole('button', {
      name: /switch color theme/i,
    });

    expect(themeSwitchButton).toBeInTheDocument();
  });
});
