import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { IdClipboardButton } from './id-clipboard-button';

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const MOCK_ID = '797ac92c-e9b1-4ce4-b146-a62e8f2193a4';

describe('IdClipboardButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a label and a copy control', () => {
    render(<IdClipboardButton label="User ID" />);
    expect(screen.getByText('User ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy ID' })).toBeInTheDocument();
  });

  it('displays provided id', () => {
    render(<IdClipboardButton id={MOCK_ID} />);
    expect(screen.getByRole('button', { name: 'Copy ID' })).toHaveTextContent(
      MOCK_ID,
    );
  });

  it('copies id to clipboard and shows success toast when clicked', async () => {
    render(<IdClipboardButton id={MOCK_ID} />);
    const user = userEvent.setup();

    navigator.clipboard.writeText = jest.fn().mockResolvedValue(undefined);

    const copyButton = screen.getByRole('button', { name: 'Copy ID' });
    await user.click(copyButton);

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(MOCK_ID),
    );
    expect(mockAddToast).toHaveBeenCalledWith('ID copied.', 'success');
  });

  it('copies id to clipboard when activated from the keyboard', async () => {
    render(<IdClipboardButton id={MOCK_ID} />);
    const user = userEvent.setup();

    navigator.clipboard.writeText = jest.fn().mockResolvedValue(undefined);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Copy ID' })).toHaveFocus();
    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(MOCK_ID),
    );
    expect(mockAddToast).toHaveBeenCalledWith('ID copied.', 'success');
  });

  it('shows error toast if clipboard fails', async () => {
    render(<IdClipboardButton id={MOCK_ID} />);
    const user = userEvent.setup();

    navigator.clipboard.writeText = jest
      .fn()
      .mockRejectedValue(new Error('fail'));

    const copyButton = screen.getByRole('button', { name: 'Copy ID' });
    await user.click(copyButton);

    await waitFor(() =>
      expect(mockAddToast).toHaveBeenCalledWith(
        'Clipboard not allowed.',
        'error',
      ),
    );
  });
});
