import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useToasts } from '@/features/common/hooks/use-toasts';

import { ToastsProvider } from '../../providers/toasts/toasts';
import { Toaster } from './toaster';

const TEST_TOAST_MESSAGE = 'test toast';
const TOAST_LIFETIME = 500;

function ToastAdder() {
  const { addToast } = useToasts();

  return (
    <button type="button" onClick={() => addToast(TEST_TOAST_MESSAGE, 'info')}>
      Add toast
    </button>
  );
}

describe('Toaster', () => {
  it('should render a notification toaster container', async () => {
    render(<Toaster />);

    const toaster = screen.getByRole('region', { name: /notifications/i });

    await waitFor(() => expect(toaster).toBeInTheDocument());
  });

  it('should render a toast when toast is added to context', async () => {
    const user = userEvent.setup();
    const toastNameRegExp = new RegExp(TEST_TOAST_MESSAGE, 'i');
    render(
      <ToastsProvider>
        <ToastAdder />
        <Toaster />
      </ToastsProvider>,
    );

    const addToastButton = screen.getByRole('button', { name: /add toast/i });
    await user.click(addToastButton);
    const testToast = screen.getByRole('listitem', { name: toastNameRegExp });

    expect(testToast).toBeInTheDocument();
  });

  it('should remove added toast after some time', async () => {
    const user = userEvent.setup();
    const toastNameRegExp = new RegExp(TEST_TOAST_MESSAGE, 'i');
    render(
      <ToastsProvider>
        <ToastAdder />
        <Toaster toastLifeTime={TOAST_LIFETIME} />
      </ToastsProvider>,
    );

    const addToastButton = screen.getByRole('button', { name: /add toast/i });
    await user.click(addToastButton);
    const testToast = screen.getByRole('listitem', { name: toastNameRegExp });

    expect(testToast).toBeInTheDocument();

    await waitForElementToBeRemoved(
      () => screen.queryByRole('listitem', { name: toastNameRegExp }),
      {
        timeout: TOAST_LIFETIME * 2,
      },
    );

    expect(testToast).not.toBeInTheDocument();
  });

  it('should not remove toast while user hover over toasts', async () => {
    const user = userEvent.setup();
    const toastNameRegExp = new RegExp(TEST_TOAST_MESSAGE, 'i');
    render(
      <ToastsProvider>
        <ToastAdder />
        <Toaster toastLifeTime={TOAST_LIFETIME} />
      </ToastsProvider>,
    );

    const addToastButton = screen.getByRole('button', { name: /add toast/i });
    await user.click(addToastButton);
    const testToast = screen.getByRole('listitem', { name: toastNameRegExp });

    await user.hover(testToast);
    try {
      /*
       * While user hovering toasts wait for the toast to be removed.
       * (timeout = not removed), so ensure if the toast it's in the document.
       */
      await waitForElementToBeRemoved(
        () => screen.queryByRole('listitem', { name: toastNameRegExp }),
        {
          timeout: TOAST_LIFETIME * 2,
        },
      );
    } catch (_error) {
      expect(testToast).toBeInTheDocument();
    }

    await user.unhover(testToast);
    await waitForElementToBeRemoved(
      () => screen.queryByRole('listitem', { name: toastNameRegExp }),
      {
        timeout: TOAST_LIFETIME * 2,
      },
    );
    expect(testToast).not.toBeInTheDocument();
  });
});
