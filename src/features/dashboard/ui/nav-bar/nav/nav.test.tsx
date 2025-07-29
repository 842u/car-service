import { render, screen } from '@testing-library/react';

import { Nav } from './nav';

jest.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => '/dashboard',
  usePathname: () => '/dashboard',
}));

describe('Nav', () => {
  it('should render dashboard navigation menu', () => {
    render(<Nav />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    expect(dashboardMenu).toBeInTheDocument();
  });

  it('should render a link to dashboard root tab', () => {
    render(<Nav />);

    const dashboardHomeLink = screen.getByRole('link', { name: /dashboard/i });

    expect(dashboardHomeLink).toBeInTheDocument();
  });

  it('should render a link to dashboard cars tab', () => {
    render(<Nav />);

    const dashboardCarsLink = screen.getByRole('link', { name: /cars/i });

    expect(dashboardCarsLink).toBeInTheDocument();
  });

  it('should render a link to dashboard account settings tab', () => {
    render(<Nav />);

    const dashboardAccountLink = screen.getByRole('link', { name: /account/i });

    expect(dashboardAccountLink).toBeInTheDocument();
  });

  it('should render a link to sign out', () => {
    render(<Nav />);

    const signOutLink = screen.getByRole('link', { name: /sign out/i });

    expect(signOutLink).toBeInTheDocument();
  });

  it('should render a color theme switch button', () => {
    render(<Nav />);

    const themeSwitchButton = screen.getByRole('button', {
      name: /switch color theme/i,
    });

    expect(themeSwitchButton).toBeInTheDocument();
  });
});
