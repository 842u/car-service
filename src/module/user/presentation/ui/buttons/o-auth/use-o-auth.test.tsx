import { act, renderHook } from '@testing-library/react';

import { createMockAuthClient } from '@/lib/jest/mock/src/common/application/auth-client';

jest.mock('@/dependency/auth-client/browser', () => ({
  browserAuthClient: createMockAuthClient(),
}));

const mockAddToast = jest.fn();

jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

import { browserAuthClient } from '@/dependency/auth-client/browser';

import { useOAuth } from './use-o-auth';

const mockAuthClient = browserAuthClient as jest.Mocked<
  typeof browserAuthClient
>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useOAuth', () => {
  it('should return isLoading as false initially', () => {
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: true,
      data: null,
    });

    const { result } = renderHook(() => useOAuth('github'));

    expect(result.current.isLoading).toBe(false);
  });

  it('should set isLoading to true when handleSignIn is called', () => {
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

    const { result } = renderHook(() => useOAuth('github'));

    act(() => {
      result.current.handleSignIn();
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      resolve();
    });
  });

  it('should call signInWithOAuth with correct provider and redirect URL', async () => {
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: true,
      data: null,
    });

    const { result } = renderHook(() => useOAuth('github'));

    await act(async () => await result.current.handleSignIn());

    expect(mockAuthClient.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'github',
      options: { redirectTo: 'http://localhost/api/auth/o-auth' },
    });
  });

  it('should show success toast on successful sign-in', async () => {
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: true,
      data: null,
    });

    const { result } = renderHook(() => useOAuth('github'));

    await act(async () => await result.current.handleSignIn());

    expect(mockAddToast).toHaveBeenCalledWith(
      'Successfully connected with GitHub.',
      'success',
    );
  });

  it('should show error toast on failed sign-in', async () => {
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: false,
      error: { message: 'Connection failed', code: 'auth_error', status: 500 },
    });

    const { result } = renderHook(() => useOAuth('github'));

    await act(async () => await result.current.handleSignIn());

    expect(mockAddToast).toHaveBeenCalledWith('Connection failed', 'error');
  });

  it('should set isLoading back to false on failed sign-in', async () => {
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: false,
      error: { message: 'Connection failed', code: 'auth_error', status: 500 },
    });

    const { result } = renderHook(() => useOAuth('github'));

    await act(async () => await result.current.handleSignIn());

    expect(result.current.isLoading).toBe(false);
  });

  it('should keep isLoading true on successful sign-in', async () => {
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: true,
      data: null,
    });

    const { result } = renderHook(() => useOAuth('github'));

    await act(async () => await result.current.handleSignIn());

    expect(result.current.isLoading).toBe(true);
  });

  it('should show correct provider name for google', async () => {
    mockAuthClient.signInWithOAuth.mockResolvedValue({
      success: true,
      data: null,
    });

    const { result } = renderHook(() => useOAuth('google'));

    await act(async () => await result.current.handleSignIn());

    expect(mockAddToast).toHaveBeenCalledWith(
      'Successfully connected with Google.',
      'success',
    );
  });
});
