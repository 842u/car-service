import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Dropdown } from '../../dropdown';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('DropdownTrigger', () => {
  it('should render children via render prop', () => {
    render(
      <Dropdown>
        <Dropdown.Trigger>
          {({ ref, onClick }) => (
            <button ref={ref} onClick={onClick}>
              open menu
            </button>
          )}
        </Dropdown.Trigger>
      </Dropdown>,
    );

    expect(
      screen.getByRole('button', { name: 'open menu' }),
    ).toBeInTheDocument();
  });

  it('should open dropdown content on click', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <Dropdown.Trigger>
          {({ ref, onClick }) => (
            <button ref={ref} onClick={onClick}>
              open menu
            </button>
          )}
        </Dropdown.Trigger>
        <Dropdown.Content>
          <span>menu content</span>
        </Dropdown.Content>
      </Dropdown>,
    );

    expect(screen.queryByText('menu content')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'open menu' }));

    expect(screen.getByText('menu content')).toBeInTheDocument();
  });

  it('should close dropdown content on second click', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown>
        <Dropdown.Trigger>
          {({ ref, onClick }) => (
            <button ref={ref} onClick={onClick}>
              open menu
            </button>
          )}
        </Dropdown.Trigger>
        <Dropdown.Content>
          <span>menu content</span>
        </Dropdown.Content>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'open menu' }));
    expect(screen.getByText('menu content')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'open menu' }));
    expect(screen.queryByText('menu content')).not.toBeInTheDocument();
  });

  it('should stop click event propagation', async () => {
    const user = userEvent.setup();
    const parentClickHandler = jest.fn();

    render(
      // eslint-disable-next-line
      <div onClick={parentClickHandler}>
        <Dropdown>
          <Dropdown.Trigger>
            {({ ref, onClick }) => (
              <button ref={ref} onClick={onClick}>
                open menu
              </button>
            )}
          </Dropdown.Trigger>
        </Dropdown>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'open menu' }));

    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});
