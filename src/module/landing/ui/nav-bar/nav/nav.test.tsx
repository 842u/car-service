import { render, screen } from '@testing-library/react';

import { NavBarNav } from './nav';

describe('NavBarNav', () => {
  it('should render landing page navigation menu', () => {
    render(<NavBarNav />);

    const landingNavigation = screen.getByRole('navigation', {
      name: /landing navigation menu/i,
    });

    expect(landingNavigation).toBeInTheDocument();
  });

  it('should render a link to the dashboard page', () => {
    render(<NavBarNav />);

    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });

    expect(dashboardLink).toBeInTheDocument();
  });

  it('should render a theme switch button', () => {
    render(<NavBarNav />);

    const themeSwitchButton = screen.getByRole('button', {
      name: /switch to (dark|light) theme/i,
    });

    expect(themeSwitchButton).toBeInTheDocument();
  });

  it('should stay visible when active', () => {
    render(<NavBarNav isActive />);

    const landingMenu = screen.getByRole('navigation', {
      name: /landing navigation menu/i,
    });

    expect(landingMenu).toHaveClass('visible');
    expect(landingMenu).not.toHaveClass('invisible');
  });

  it('should leave the tab order when inactive', () => {
    render(<NavBarNav isActive={false} />);

    const landingMenu = screen.getByRole('navigation', {
      name: /landing navigation menu/i,
    });

    expect(landingMenu).toHaveClass('invisible');
    expect(landingMenu).not.toHaveClass('visible');
  });
});
