import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

import { Dropdown, useDropdown } from './dropdown';

beforeEach(() => {
  jest.clearAllMocks();
});

function renderDropdown() {
  return render(
    <>
      <button>outside</button>
      <Dropdown>
        <Dropdown.Trigger>
          {({ ref, onClick }) => (
            <button ref={ref} onClick={onClick}>
              open
            </button>
          )}
        </Dropdown.Trigger>
        <Dropdown.Content>
          <button>menu content</button>
        </Dropdown.Content>
      </Dropdown>
    </>,
  );
}

describe('Dropdown', () => {
  it('should render children', () => {
    render(<Dropdown>content</Dropdown>);

    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('should apply className to wrapper div', () => {
    render(<Dropdown className="custom-class">content</Dropdown>);

    expect(screen.getByText('content')).toHaveClass('custom-class');
  });

  it('should not render content initially', () => {
    renderDropdown();

    expect(screen.queryByText('menu content')).not.toBeInTheDocument();
  });

  it('should show content after trigger click', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));

    expect(screen.getByText('menu content')).toBeInTheDocument();
  });

  it('should hide content after second trigger click', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    await user.click(screen.getByRole('button', { name: 'open' }));

    expect(screen.queryByText('menu content')).not.toBeInTheDocument();
  });

  it('should render opened content with top and left position styles', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));

    const content = screen.getByText('menu content');
    // eslint-disable-next-line testing-library/no-node-access
    expect(content.parentElement).toHaveAttribute('style');
  });
});

describe('dismissal', () => {
  it('should close when clicking outside', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    expect(screen.getByText('menu content')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'outside' }));

    expect(screen.queryByText('menu content')).not.toBeInTheDocument();
  });

  it('should not close when clicking inside the panel', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    await user.click(screen.getByRole('button', { name: 'menu content' }));

    expect(screen.getByText('menu content')).toBeInTheDocument();
  });

  it('should close when focus moves outside the dropdown', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    const trigger = screen.getByRole('button', { name: 'open' });
    const outside = screen.getByRole('button', { name: 'outside' });

    fireEvent.focusOut(trigger, { relatedTarget: outside });

    expect(screen.queryByText('menu content')).not.toBeInTheDocument();
  });

  it('should not close when focus moves to the panel', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    const trigger = screen.getByRole('button', { name: 'open' });
    const panelButton = screen.getByRole('button', { name: 'menu content' });

    fireEvent.focusOut(trigger, { relatedTarget: panelButton });

    expect(screen.getByText('menu content')).toBeInTheDocument();
  });

  it('should not close when focus moves back to the trigger', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    const trigger = screen.getByRole('button', { name: 'open' });
    const panelButton = screen.getByRole('button', { name: 'menu content' });

    fireEvent.focusOut(panelButton, { relatedTarget: trigger });

    expect(screen.getByText('menu content')).toBeInTheDocument();
  });

  it('should not close when relatedTarget is null', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    const trigger = screen.getByRole('button', { name: 'open' });

    fireEvent.focusOut(trigger, { relatedTarget: null });

    expect(screen.getByText('menu content')).toBeInTheDocument();
  });

  it('should close and restore focus to the trigger on Escape', async () => {
    const user = userEvent.setup();
    renderDropdown();
    const trigger = screen.getByRole('button', { name: 'open' });

    await user.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });

    expect(screen.queryByText('menu content')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('should not close for other keys', async () => {
    const user = userEvent.setup();
    renderDropdown();
    const trigger = screen.getByRole('button', { name: 'open' });

    await user.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(screen.getByText('menu content')).toBeInTheDocument();
  });

  it('should leave the panel open when Escape is pressed outside the dropdown', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    const outside = screen.getByRole('button', { name: 'outside' });

    fireEvent.keyDown(outside, { key: 'Escape' });

    expect(screen.getByText('menu content')).toBeInTheDocument();
  });
});

describe('opening focus', () => {
  it('should focus the trigger when opening', () => {
    renderDropdown();
    const trigger = screen.getByRole('button', { name: 'open' });
    const focusSpy = jest.spyOn(trigger, 'focus');

    // fireEvent, not userEvent: userEvent's own pointer choreography also
    // focuses the clicked button, which would count alongside the explicit
    // `triggerRef.current?.focus()` this test targets.
    fireEvent.click(trigger);

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('should not refocus the trigger on a second toggle', () => {
    renderDropdown();
    const trigger = screen.getByRole('button', { name: 'open' });
    const focusSpy = jest.spyOn(trigger, 'focus');

    fireEvent.click(trigger);
    fireEvent.click(trigger);

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});

describe('useDropdown', () => {
  it('should throw when used outside Dropdown', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => renderHook(() => useDropdown())).toThrow();

    consoleSpy.mockRestore();
  });

  it('should return full context value when inside Dropdown', () => {
    function wrapper({ children }: { children: ReactNode }) {
      return <Dropdown>{children}</Dropdown>;
    }

    const { result } = renderHook(() => useDropdown(), { wrapper });

    expect(result.current).toMatchObject({
      isOpen: false,
      toggle: expect.any(Function),
      close: expect.any(Function),
      triggerRef: expect.objectContaining({ current: null }),
      collisionDetectionRoot: null,
      contentId: expect.any(String),
    });
  });
});
