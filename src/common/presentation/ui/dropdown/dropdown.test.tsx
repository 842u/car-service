import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';

import { Dropdown, useDropdown } from './dropdown';

beforeEach(() => {
  jest.clearAllMocks();
});

function renderDropdown() {
  return render(
    <Dropdown>
      <Dropdown.Trigger>
        {({ ref, onClick }) => (
          <button ref={ref} onClick={onClick}>
            open
          </button>
        )}
      </Dropdown.Trigger>
      <Dropdown.Content>
        <span>menu content</span>
      </Dropdown.Content>
    </Dropdown>,
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

  it('should close content when clicking outside', async () => {
    const user = userEvent.setup();
    renderDropdown();

    await user.click(screen.getByRole('button', { name: 'open' }));
    expect(screen.getByText('menu content')).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByText('menu content')).not.toBeInTheDocument();
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
    });
  });
});
