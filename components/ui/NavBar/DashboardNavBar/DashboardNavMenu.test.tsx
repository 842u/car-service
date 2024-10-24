import { render, screen } from '@testing-library/react';

import { DashboardNavMenu } from './DashboardNavMenu';

jest.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => '/dashboard',
  usePathname: () => '/dashboard',
}));

describe('DashboardNavMenu', () => {
  it('should render dashboard navigation menu', () => {
    render(<DashboardNavMenu />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    expect(dashboardMenu).toBeInTheDocument();
  });

  it('should render a linkt to dashboard root tab', () => {
    render(<DashboardNavMenu />);

    const dashboardHomeLink = screen.getByRole('link', { name: /dashboard/i });

    expect(dashboardHomeLink).toBeInTheDocument();
  });

  it('should render a link to dashboard cars tab', () => {
    render(<DashboardNavMenu />);

    const dashboardCarsLink = screen.getByRole('link', { name: /cars/i });

    expect(dashboardCarsLink).toBeInTheDocument();
  });

  it('should render a link to dashboard account settings tab', () => {
    render(<DashboardNavMenu />);

    const dashboardAccountLink = screen.getByRole('link', { name: /account/i });

    expect(dashboardAccountLink).toBeInTheDocument();
  });

  it('should render a link to sign out', () => {
    render(<DashboardNavMenu />);

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toBeInTheDocument();
  });

  it('should render a color theme switch button', () => {
    render(<DashboardNavMenu />);

    const themeSwitchButton = screen.getByRole('button', {
      name: /switch color theme/i,
    });

    expect(themeSwitchButton).toBeInTheDocument();
  });
});
