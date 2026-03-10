import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';
import { SPINNER_TEST_ID } from '@/ui/decorative/spinner/spinner';

jest.mock('@/dependency/auth-client/browser', () => ({
  browserAuthClient: createMockAuthClient(),
}));

const mockAddToast = jest.fn();

jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

import { browserAuthClient } from '@/dependency/auth-client/browser';

import { OAuthButton } from './o-auth';

const mockAuthClient = browserAuthClient as jest.Mocked<
  typeof browserAuthClient
>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('OAuthButton', () => {
  it('should render button with github provider text', () => {
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: true,
      data: null,
    });

    render(<OAuthButton provider="github" />);

    expect(
      screen.getByRole('button', { name: /continue with github/i }),
    ).toBeInTheDocument();
  });

  it('should render button with google provider text', () => {
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: true,
      data: null,
    });

    render(<OAuthButton provider="google" />);

    expect(
      screen.getByRole('button', { name: /continue with google/i }),
    ).toBeInTheDocument();
  });

  it('should not render spinner initially', () => {
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: true,
      data: null,
    });

    render(<OAuthButton provider="github" />);

    expect(screen.queryByTestId(SPINNER_TEST_ID)).not.toBeInTheDocument();
  });

  it('should call signInWithOAuth on button click', async () => {
    const user = userEvent.setup();
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: true,
      data: null,
    });

    render(<OAuthButton provider="github" />);

    const button = screen.getByRole('button', {
      name: /continue with github/i,
    });
    await user.click(button);

    expect(mockAuthClient.signInWithOAuth).toHaveBeenCalledTimes(1);
  });

  it('should render spinner while loading', async () => {
    const user = userEvent.setup();
    /**
     * Create a deferred promise so we can manually control when signInWithOAuth resolves.
     * This allows us to assert the intermediate state (isLoading = true) before the async operation completes.
     */
    let resolve: () => void;
    mockAuthClient.signInWithOAuth.mockReturnValue(
      new Promise<{ success: true; data: null }>((r) => {
        resolve = () => r({ success: true, data: null });
      }),
    );

    render(<OAuthButton provider="github" />);

    const button = screen.getByRole('button', {
      name: /continue with github/i,
    });
    await user.click(button);

    expect(screen.getByTestId(SPINNER_TEST_ID)).toBeInTheDocument();

    resolve!();
  });

  it('should hide spinner after failed sign-in', async () => {
    const user = userEvent.setup();
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: false,
      error: { message: 'Connection failed', code: 'auth_error', status: 500 },
    });

    render(<OAuthButton provider="github" />);

    const button = screen.getByRole('button', {
      name: /continue with github/i,
    });
    await user.click(button);

    expect(screen.queryByTestId(SPINNER_TEST_ID)).not.toBeInTheDocument();
  });
});
