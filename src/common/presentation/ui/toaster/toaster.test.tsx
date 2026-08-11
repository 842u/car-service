import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { ToastsProvider } from '@/common/presentation/provider/toasts/toasts';

import { Toaster } from './toaster';

const TEST_TOAST_MESSAGE = 'test toast';
const TOAST_LIFETIME = 500;
const toastNameRegExp = new RegExp(TEST_TOAST_MESSAGE, 'i');

function ToastAdder() {
  const { addToast } = useToasts();

  return (
    <button type="button" onClick={() => addToast(TEST_TOAST_MESSAGE, 'info')}>
      Add toast
    </button>
  );
}

function MultiTypeToastAdder() {
  const { addToast } = useToasts();

  return (
    <>
      <button type="button" onClick={() => addToast('all good', 'success')}>
        Add success
      </button>
      <button
        type="button"
        onClick={() => addToast('something broke', 'error')}
      >
        Add error
      </button>
    </>
  );
}

describe('Toaster', () => {
  it('should render a notification toaster container', async () => {
    render(<Toaster />);

    const toaster = screen.getByRole('region', { name: /notifications/i });

    await waitFor(() => expect(toaster).toBeInTheDocument());
  });

  it('should mark the toast list as a live region', () => {
    render(<Toaster />);

    const toastList = screen.getByRole('list');

    expect(toastList).toHaveAttribute('aria-live', 'polite');
  });

  it('should render a toast when toast is added to context', async () => {
    const user = userEvent.setup();
    render(
      <ToastsProvider>
        <ToastAdder />
        <Toaster />
      </ToastsProvider>,
    );

    const addToastButton = screen.getByRole('button', { name: /add toast/i });
    await user.click(addToastButton);
    const testToast = screen.getByRole('listitem');

    expect(testToast).toHaveTextContent(toastNameRegExp);
  });

  it('should announce a success and an error toast, each once, with the type included', async () => {
    const user = userEvent.setup();
    render(
      <ToastsProvider>
        <MultiTypeToastAdder />
        <Toaster />
      </ToastsProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Add success' }));
    await user.click(screen.getByRole('button', { name: 'Add error' }));

    const toasts = screen.getAllByRole('listitem');

    expect(toasts).toHaveLength(2);
    expect(toasts[0]).toHaveTextContent(/success:/i);
    expect(toasts[0]).toHaveTextContent('all good');
    expect(toasts[1]).toHaveTextContent(/error:/i);
    expect(toasts[1]).toHaveTextContent('something broke');
  });

  it('should remove added toast after toastLifeTime', async () => {
    const user = userEvent.setup();
    render(
      <ToastsProvider>
        <ToastAdder />
        <Toaster toastLifeTime={TOAST_LIFETIME} />
      </ToastsProvider>,
    );

    const addToastButton = screen.getByRole('button', { name: /add toast/i });
    await user.click(addToastButton);
    const testToast = screen.getByRole('listitem');

    expect(testToast).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.queryByRole('listitem'), {
      timeout: TOAST_LIFETIME * 2,
    });

    expect(testToast).not.toBeInTheDocument();
  });

  it('should not remove toast while user hover over toasts', async () => {
    const user = userEvent.setup();
    render(
      <ToastsProvider>
        <ToastAdder />
        <Toaster toastLifeTime={TOAST_LIFETIME} />
      </ToastsProvider>,
    );

    const addToastButton = screen.getByRole('button', { name: /add toast/i });
    await user.click(addToastButton);
    const testToast = screen.getByRole('listitem');

    await user.hover(testToast);
    await new Promise((resolve) => setTimeout(resolve, TOAST_LIFETIME + 100));
    expect(testToast).toBeInTheDocument();

    await user.unhover(testToast);
    await waitForElementToBeRemoved(() => screen.queryByRole('listitem'), {
      timeout: TOAST_LIFETIME * 2,
    });
    expect(testToast).not.toBeInTheDocument();
  });
});
