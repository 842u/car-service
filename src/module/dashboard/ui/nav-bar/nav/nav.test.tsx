import { render, screen } from '@testing-library/react';

import { NavBarNav } from './nav';

jest.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => '/dashboard',
  usePathname: () => '/dashboard',
}));

describe('NavBarNav', () => {
  it('should render dashboard navigation menu', () => {
    render(<NavBarNav navMode="auto" />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    expect(dashboardMenu).toBeInTheDocument();
  });

  it('should render a link to dashboard root tab', () => {
    render(<NavBarNav navMode="auto" />);

    const dashboardHomeLink = screen.getByRole('link', { name: /overview/i });

    expect(dashboardHomeLink).toBeInTheDocument();
  });

  it('should render a link to dashboard cars tab', () => {
    render(<NavBarNav navMode="auto" />);

    const dashboardCarsLink = screen.getByRole('link', { name: /cars/i });

    expect(dashboardCarsLink).toBeInTheDocument();
  });

  it('should render a link to dashboard account settings tab', () => {
    render(<NavBarNav navMode="auto" />);

    const dashboardAccountLink = screen.getByRole('link', { name: /account/i });

    expect(dashboardAccountLink).toBeInTheDocument();
  });

  it('should render a link to sign out', () => {
    render(<NavBarNav navMode="auto" />);

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toBeInTheDocument();
  });

  it('should render a nav mode control reporting the current mode', () => {
    render(<NavBarNav navMode="expanded" />);

    const navModeControl = screen.getByRole('button', {
      name: 'Navigation menu mode: Expanded',
    });

    expect(navModeControl).toBeInTheDocument();
  });

  it('should render a color theme switch button', () => {
    render(<NavBarNav navMode="auto" />);

    const themeSwitchButton = screen.getByRole('button', {
      name: /switch to (dark|light) theme/i,
    });

    expect(themeSwitchButton).toBeInTheDocument();
  });

  it('should stay visible when active', () => {
    render(<NavBarNav isActive navMode="auto" />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    expect(dashboardMenu).toHaveClass('visible');
    expect(dashboardMenu).not.toHaveClass('invisible');
  });

  it('should leave the tab order when inactive', () => {
    render(<NavBarNav isActive={false} navMode="auto" />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    expect(dashboardMenu).toHaveClass('invisible');
    expect(dashboardMenu).not.toHaveClass('visible');
  });
});
