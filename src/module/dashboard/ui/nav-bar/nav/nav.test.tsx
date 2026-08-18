import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

  it('should hold its reveal while it contains a visible focus', () => {
    render(<NavBarNav navMode="auto" />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    // `:focus-visible`, not `:focus-within`: a click leaves the control it
    // landed on focused, and holding the reveal for that would keep the nav
    // open until the user clicked elsewhere.
    expect(dashboardMenu).toHaveClass('md:nav-auto:has-focus-visible:min-w-56');
  });

  it('should hold its reveal while a control inside it has a panel open', async () => {
    const user = userEvent.setup();
    render(<NavBarNav navMode="auto" />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    await user.click(
      within(dashboardMenu).getByRole('button', {
        name: /^navigation menu mode:/i,
      }),
    );

    // The rule reads the trigger's own `aria-expanded`, so the two halves of
    // the hold are asserted together: the nav carries the rule, and the
    // attribute it selects on flips on an element the nav contains. The panel
    // itself is portaled out and is deliberately not what the rule looks for.
    expect(dashboardMenu).toHaveClass('md:nav-auto:has-aria-expanded:min-w-56');
    expect(
      within(dashboardMenu).getByRole('button', {
        name: /^navigation menu mode:/i,
      }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('should not animate under reduced motion', () => {
    render(<NavBarNav navMode="auto" />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    expect(dashboardMenu).toHaveClass('motion-reduce:transition-none');
  });

  it('should not animate a mode change', () => {
    render(<NavBarNav navMode="auto" />);

    const dashboardMenu = screen.getByRole('navigation', {
      name: /dashboard navigation menu/i,
    });

    // `width` is what a mode sets and `min-width` is what the reveal moves,
    // so naming the properties is what keeps a mode change instant.
    expect(dashboardMenu).toHaveClass(
      'transition-[background-color,border-color,min-width,translate,visibility]',
    );
  });
});
