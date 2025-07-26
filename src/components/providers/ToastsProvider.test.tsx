import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useToasts } from '@/features/common/hooks/useToasts';
import { ToastType } from '@/types';

import { ToastsProvider } from './ToastsProvider';

const TOAST_TEST_ID = 'toast';
const TOAST_MESSAGE = 'test message';
const TOAST_TYPE: ToastType = 'info';

function TestComponent() {
  const { toasts, addToast, removeToast } = useToasts();

  return (
    <>
      <button onClick={() => addToast(TOAST_MESSAGE, TOAST_TYPE)}>
        Add Toast
      </button>
      {toasts.map((toast) => (
        <div key={toast.id} data-testid={TOAST_TEST_ID}>
          {toast.message}
          <button onClick={() => removeToast(toast.id)}>Remove Toast</button>
        </div>
      ))}
    </>
  );
}

describe('ToastsProvider', () => {
  it('initially should have no toasts', () => {
    render(
      <ToastsProvider>
        <TestComponent />
      </ToastsProvider>,
    );

    const toast = screen.queryByTestId(TOAST_TEST_ID);

    expect(toast).not.toBeInTheDocument();
  });

  it('should add toast on addToast call', async () => {
    const user = userEvent.setup();
    render(
      <ToastsProvider>
        <TestComponent />
      </ToastsProvider>,
    );

    const addButton = screen.getByRole('button', { name: /add toast/i });
    await user.click(addButton);
    const toast = screen.getByText(TOAST_MESSAGE);

    expect(toast).toBeInTheDocument();
  });

  it('should remove toast on removeToast call', async () => {
    const user = userEvent.setup();
    render(
      <ToastsProvider>
        <TestComponent />
      </ToastsProvider>,
    );

    const addButton = screen.getByRole('button', { name: /add toast/i });
    await user.click(addButton);
    const removeButton = screen.getByRole('button', { name: /remove toast/i });
    await user.click(removeButton);
    const toast = screen.queryByText(TOAST_MESSAGE);

    expect(toast).not.toBeInTheDocument();
  });
});
