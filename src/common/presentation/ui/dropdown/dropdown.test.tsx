import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

import { Dropdown, useDropdown } from './dropdown';

beforeEach(() => {
  jest.clearAllMocks();
});

function renderDropdown(panelExtras?: ReactNode) {
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
          <button>last item</button>
          {panelExtras}
        </Dropdown.Content>
      </Dropdown>
    </>,
  );
}

/** The portaled panel, which is the element `contentRef` points at. */
function getPanel() {
  return screen.getByText('menu content').parentElement;
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

    expect(getPanel()).toHaveAttribute('style');
  });

  it('should render the panel outside the dropdown, in document.body', async () => {
    const user = userEvent.setup();
    const { container } = renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));

    const panel = getPanel();

    expect(container).not.toContainElement(panel);
    // eslint-disable-next-line testing-library/no-node-access
    expect(panel?.parentElement).toBe(document.body);
  });

  it('should take the portaled panel back out of the document when closed', async () => {
    const user = userEvent.setup();
    renderDropdown();
    const trigger = screen.getByRole('button', { name: 'open' });

    await user.click(trigger);
    const panel = getPanel();

    await user.click(trigger);

    expect(panel).not.toBeInTheDocument();
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

  it('should close when Escape is pressed outside the dropdown', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    const outside = screen.getByRole('button', { name: 'outside' });

    fireEvent.keyDown(outside, { key: 'Escape' });

    expect(screen.queryByText('menu content')).not.toBeInTheDocument();
  });

  it('should reopen after Escape closed it', async () => {
    const user = userEvent.setup();
    renderDropdown();
    const trigger = screen.getByRole('button', { name: 'open' });

    await user.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Escape' });
    await user.click(trigger);

    expect(screen.getByText('menu content')).toBeInTheDocument();
  });
});

describe('focus management', () => {
  it('should move focus to the panel when opening', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));

    expect(getPanel()).toHaveFocus();
  });

  it('should leave focus on the element clicked outside', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    const outside = screen.getByRole('button', { name: 'outside' });
    await user.click(outside);

    expect(screen.queryByText('menu content')).not.toBeInTheDocument();
    expect(outside).toHaveFocus();
  });

  it('should return focus to the trigger when tabbing off the last control', async () => {
    const user = userEvent.setup();
    renderDropdown();
    const trigger = screen.getByRole('button', { name: 'open' });

    await user.click(trigger);
    const lastItem = screen.getByRole('button', { name: 'last item' });
    lastItem.focus();

    // fireEvent, not userEvent: what is asserted is where the handler puts
    // focus during keydown. jsdom does not run Tab's default action, which is
    // the half that then carries focus on past the trigger.
    fireEvent.keyDown(lastItem, { key: 'Tab' });

    expect(trigger).toHaveFocus();
  });

  it('should return focus to the trigger when shift-tabbing off the panel', async () => {
    const user = userEvent.setup();
    renderDropdown();
    const trigger = screen.getByRole('button', { name: 'open' });

    await user.click(trigger);

    fireEvent.keyDown(getPanel()!, { key: 'Tab', shiftKey: true });

    expect(trigger).toHaveFocus();
  });

  it('should return focus to the trigger when shift-tabbing off the first control', async () => {
    const user = userEvent.setup();
    renderDropdown();
    const trigger = screen.getByRole('button', { name: 'open' });

    await user.click(trigger);
    const firstItem = screen.getByRole('button', { name: 'menu content' });
    firstItem.focus();

    // The container holds focus on open but its tabindex of -1 keeps it out of
    // the sequential order, so Shift+Tab from here leaves the panel outright.
    fireEvent.keyDown(firstItem, { key: 'Tab', shiftKey: true });

    expect(trigger).toHaveFocus();
  });

  it('should find the boundary at the last control Tab can reach', async () => {
    const user = userEvent.setup();
    renderDropdown(
      <>
        <button tabIndex={-1}>programmatic only</button>
        <button disabled>unavailable</button>
      </>,
    );
    const trigger = screen.getByRole('button', { name: 'open' });

    await user.click(trigger);
    const lastItem = screen.getByRole('button', { name: 'last item' });
    lastItem.focus();

    // Both trailing buttons are focusable nodes that Tab never lands on, so
    // neither is the end of the panel's tab order.
    fireEvent.keyDown(lastItem, { key: 'Tab' });

    expect(trigger).toHaveFocus();
  });

  it('should not move focus when tabbing between panel controls', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    const firstItem = screen.getByRole('button', { name: 'menu content' });
    firstItem.focus();

    fireEvent.keyDown(firstItem, { key: 'Tab' });

    expect(firstItem).toHaveFocus();
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
      contentRef: expect.objectContaining({ current: null }),
      collisionDetectionRoot: null,
      contentId: expect.any(String),
    });
  });

  it('should hold the rendered panel in contentRef', async () => {
    const user = userEvent.setup();

    function wrapper({ children }: { children: ReactNode }) {
      return (
        <Dropdown>
          {children}
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
      );
    }

    const { result } = renderHook(() => useDropdown(), { wrapper });
    await user.click(screen.getByRole('button', { name: 'open' }));

    expect(result.current.contentRef.current).toBe(
      // eslint-disable-next-line testing-library/no-node-access
      screen.getByText('menu content').parentElement,
    );
  });
});
