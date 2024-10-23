import { render, screen } from '@testing-library/react';

import { UserProfileProvider } from '@/components/providers/UserProfileProvider';

import { USER_BADGE_TEST_ID } from '../../UserBadge/UserBadge';
import { DashboardNavBar } from './DashboardNavBar';

jest.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => '/dashboard',
  usePathname: () => '/dashboard',
}));

describe('DashboardNavBar', () => {
  it('should render dashboard menu', () => {
    render(
      <UserProfileProvider>
        <DashboardNavBar />
      </UserProfileProvider>,
    );

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    expect(dashboardMenu).toBeInTheDocument();
  });

  it('should render a brand logo link to landing page', () => {
    render(
      <UserProfileProvider>
        <DashboardNavBar />
      </UserProfileProvider>,
    );

    const landingPageLink = screen.getByRole('link', { name: /landing page/i });

    expect(landingPageLink).toBeInTheDocument();
  });

  it('should render a hamburger button for nav menu toggle', () => {
    render(
      <UserProfileProvider>
        <DashboardNavBar />
      </UserProfileProvider>,
    );

    const menuToggleButton = screen.getByRole('button', {
      name: /toggle navigation menu/i,
    });

    expect(menuToggleButton).toBeInTheDocument();
  });

  it('should render a user badge', () => {
    render(
      <UserProfileProvider>
        <DashboardNavBar />
      </UserProfileProvider>,
    );

    const userBadge = screen.getByTestId(USER_BADGE_TEST_ID);

    expect(userBadge).toBeInTheDocument();
  });
});
