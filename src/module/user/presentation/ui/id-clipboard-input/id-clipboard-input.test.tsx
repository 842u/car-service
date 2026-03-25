import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { IdClipboardInput } from './id-clipboard-input';

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const MOCK_ID = '797ac92c-e9b1-4ce4-b146-a62e8f2193a4';

describe('IdClipboardInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input with label and is read-only', () => {
    render(<IdClipboardInput label="User ID" />);
    expect(screen.getByText('User ID')).toBeInTheDocument();
    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('readonly');
  });

  it('displays provided id', () => {
    render(<IdClipboardInput id={MOCK_ID} />);
    const input = screen.getByDisplayValue(MOCK_ID) as HTMLInputElement;
    expect(input.value).toBe(MOCK_ID);
  });

  it('copies id to clipboard and shows success toast', async () => {
    render(<IdClipboardInput id={MOCK_ID} />);
    const user = userEvent.setup();

    navigator.clipboard.writeText = jest.fn().mockResolvedValue(undefined);

    const input = screen.getByDisplayValue(MOCK_ID);
    await user.click(input);

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(MOCK_ID),
    );
    expect(mockAddToast).toHaveBeenCalledWith('ID copied.', 'success');
  });

  it('shows error toast if clipboard fails', async () => {
    render(<IdClipboardInput id={MOCK_ID} />);
    const user = userEvent.setup();

    navigator.clipboard.writeText = jest
      .fn()
      .mockRejectedValue(new Error('fail'));

    const input = screen.getByDisplayValue(MOCK_ID);
    await user.click(input);

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'Clipboard not allowed.',
        'error',
      ),
    );
  });
});
