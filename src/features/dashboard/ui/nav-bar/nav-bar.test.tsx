import { render, screen, waitFor } from '@testing-library/react';

import { TanStackQueryProvider } from '@/features/common/providers/tan-stack-query';
import { SPINNER_TEST_ID } from '@/ui/decorative/spinner-tempname/spinner-tempname';

import { NavBar } from './nav-bar';

jest.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => '/dashboard',
  usePathname: () => '/dashboard',
}));

function TestNavBar() {
  return (
    <TanStackQueryProvider>
      <NavBar />
    </TanStackQueryProvider>
  );
}

describe('NavBar', () => {
  it('should render dashboard menu', async () => {
    render(<TestNavBar />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    await waitFor(() => expect(dashboardMenu).toBeInTheDocument());
  });

  it('should render a brand logo link to home page', async () => {
    render(<TestNavBar />);

    const landingPageLink = screen.getByRole('link', { name: /home/i });

    await waitFor(() => expect(landingPageLink).toBeInTheDocument());
  });

  it('should render a hamburger button for nav menu toggle', async () => {
    render(<TestNavBar />);

    const menuToggleButton = screen.getByRole('button', {
      name: /toggle navigation menu/i,
    });

    await waitFor(() => expect(menuToggleButton).toBeInTheDocument());
  });

  it('should render initial loading spinner for user badge', async () => {
    render(<TestNavBar />);

    const userBadgeLoadingSpinner = screen.getByTestId(SPINNER_TEST_ID);

    await waitFor(() => expect(userBadgeLoadingSpinner).toBeInTheDocument());
  });
});
