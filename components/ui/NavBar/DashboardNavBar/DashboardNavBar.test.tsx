import { render, screen, waitFor } from '@testing-library/react';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';

import { USER_BADGE_TEST_ID } from '../../UserBadge/UserBadge';
import { DashboardNavBar } from './DashboardNavBar';

jest.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => '/dashboard',
  usePathname: () => '/dashboard',
}));

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({}),
      }),
    }),
    auth: {
      getUser: async () => ({ data: { user: {} } }),
    },
  }),
}));

describe('DashboardNavBar', () => {
  it('should render dashboard menu', async () => {
    render(
      <TanStackQueryProvider>
        <DashboardNavBar />
      </TanStackQueryProvider>,
    );

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    await waitFor(() => expect(dashboardMenu).toBeInTheDocument());
  });

  it('should render a brand logo link to landing page', async () => {
    render(
      <TanStackQueryProvider>
        <DashboardNavBar />
      </TanStackQueryProvider>,
    );

    const landingPageLink = screen.getByRole('link', { name: /landing page/i });

    await waitFor(() => expect(landingPageLink).toBeInTheDocument());
  });

  it('should render a hamburger button for nav menu toggle', async () => {
    render(
      <TanStackQueryProvider>
        <DashboardNavBar />
      </TanStackQueryProvider>,
    );

    const menuToggleButton = screen.getByRole('button', {
      name: /toggle navigation menu/i,
    });

    await waitFor(() => expect(menuToggleButton).toBeInTheDocument());
  });

  it('should render a user badge', async () => {
    render(
      <TanStackQueryProvider>
        <DashboardNavBar />
      </TanStackQueryProvider>,
    );

    const userBadge = screen.getByTestId(USER_BADGE_TEST_ID);

    await waitFor(() => expect(userBadge).toBeInTheDocument());
  });
});
