import { render, screen } from '@testing-library/react';

import { NavBarNav } from './nav';

jest.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => '/dashboard',
  usePathname: () => '/dashboard',
}));

describe('NavBarNav', () => {
  it('should render dashboard navigation menu', () => {
    render(<NavBarNav />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    expect(dashboardMenu).toBeInTheDocument();
  });

  it('should render a link to dashboard root tab', () => {
    render(<NavBarNav />);

    const dashboardHomeLink = screen.getByRole('link', { name: /dashboard/i });

    expect(dashboardHomeLink).toBeInTheDocument();
  });

  it('should render a link to dashboard cars tab', () => {
    render(<NavBarNav />);

    const dashboardCarsLink = screen.getByRole('link', { name: /cars/i });

    expect(dashboardCarsLink).toBeInTheDocument();
  });

  it('should render a link to dashboard account settings tab', () => {
    render(<NavBarNav />);

    const dashboardAccountLink = screen.getByRole('link', { name: /account/i });

    expect(dashboardAccountLink).toBeInTheDocument();
  });

  it('should render a link to sign out', () => {
    render(<NavBarNav />);

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toBeInTheDocument();
  });

  it('should render a color theme switch button', () => {
    render(<NavBarNav />);

    const themeSwitchButton = screen.getByRole('button', {
      name: /switch color theme/i,
    });

    expect(themeSwitchButton).toBeInTheDocument();
  });
});
