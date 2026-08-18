import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { applyNavMode } from '@/dashboard/ui/nav-mode/nav-mode';

import { NavModeDropdown } from './mode-dropdown';

// Only the write is mocked. The module also carries the vocabulary the panel
// renders from, and a bare factory would empty it.
jest.mock('@/dashboard/ui/nav-mode/nav-mode', () => ({
  ...jest.requireActual('@/dashboard/ui/nav-mode/nav-mode'),
  applyNavMode: jest.fn(),
}));

const mockApplyNavMode = applyNavMode as jest.Mock;

function trigger() {
  return screen.getByRole('button', { name: /^navigation menu mode:/i });
}

function option(name: string) {
  return screen.getByRole('button', { name });
}

describe('NavModeDropdown', () => {
  it('should report the current mode in the trigger name', () => {
    render(<NavModeDropdown navMode="collapsed" />);

    expect(trigger()).toHaveAccessibleName('Navigation menu mode: Collapsed');
  });

  it('should offer all three modes', async () => {
    const user = userEvent.setup();
    render(<NavModeDropdown navMode="auto" />);

    await user.click(trigger());

    expect(option('Auto')).toBeInTheDocument();
    expect(option('Collapsed')).toBeInTheDocument();
    expect(option('Expanded')).toBeInTheDocument();
  });

  it('should mark the current mode as the one in use', async () => {
    const user = userEvent.setup();
    render(<NavModeDropdown navMode="expanded" />);

    await user.click(trigger());

    expect(option('Expanded')).toHaveAttribute('aria-pressed', 'true');
    expect(option('Auto')).toHaveAttribute('aria-pressed', 'false');
    expect(option('Collapsed')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should give every mode its own tab stop', async () => {
    const user = userEvent.setup();
    render(<NavModeDropdown navMode="auto" />);

    await user.click(trigger());

    // The mode in use is not the panel's only tab stop, so the two modes the
    // user does not have are reachable without arrow keys.
    await user.tab();
    expect(option('Auto')).toHaveFocus();

    await user.tab();
    expect(option('Collapsed')).toHaveFocus();

    await user.tab();
    expect(option('Expanded')).toHaveFocus();
  });

  it('should persist and apply the selected mode', async () => {
    const user = userEvent.setup();
    render(<NavModeDropdown navMode="auto" />);

    await user.click(trigger());
    await user.click(option('Expanded'));

    expect(mockApplyNavMode).toHaveBeenCalledWith('expanded');
  });

  it('should close the panel once a mode is picked', async () => {
    const user = userEvent.setup();
    render(<NavModeDropdown navMode="auto" />);

    await user.click(trigger());
    await user.click(option('Expanded'));

    expect(
      screen.queryByRole('button', { name: 'Expanded' }),
    ).not.toBeInTheDocument();
  });

  it('should return focus to the trigger once a mode is picked', async () => {
    const user = userEvent.setup();
    render(<NavModeDropdown navMode="auto" />);

    await user.click(trigger());
    await user.click(option('Expanded'));

    expect(trigger()).toHaveFocus();
  });

  it('should move the mark to the selected mode', async () => {
    const user = userEvent.setup();
    render(<NavModeDropdown navMode="auto" />);

    await user.click(trigger());
    await user.click(option('Collapsed'));
    await user.click(trigger());

    expect(option('Collapsed')).toHaveAttribute('aria-pressed', 'true');
    expect(option('Auto')).toHaveAttribute('aria-pressed', 'false');
  });

  it('should report the selected mode in the trigger name', async () => {
    const user = userEvent.setup();
    render(<NavModeDropdown navMode="auto" />);

    await user.click(trigger());
    await user.click(option('Collapsed'));

    expect(trigger()).toHaveAccessibleName('Navigation menu mode: Collapsed');
  });
});
