import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import type { ToastType } from '@/ui/toaster/toast/toast';

import { ToastsProvider } from './toasts';

const TOAST_MESSAGE = 'test message';
const TOAST_TYPE: ToastType = 'info';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastsProvider>{children}</ToastsProvider>
);

describe('ToastsProvider', () => {
  it('initially should have no toasts', () => {
    const { result } = renderHook(() => useToasts(), { wrapper });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should add toast on addToast call', () => {
    const { result } = renderHook(() => useToasts(), { wrapper });

    act(() => {
      result.current.addToast(TOAST_MESSAGE, TOAST_TYPE);
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  it('should remove toast on removeToast call', () => {
    const { result } = renderHook(() => useToasts(), { wrapper });

    act(() => {
      result.current.addToast(TOAST_MESSAGE, TOAST_TYPE);
    });

    act(() => {
      result.current.removeToast(result.current.toasts[0].id);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should not add a second toast with the same dedupeKey', () => {
    const { result } = renderHook(() => useToasts(), { wrapper });

    act(() => {
      result.current.addToast(TOAST_MESSAGE, TOAST_TYPE, 'my-key');
      result.current.addToast(TOAST_MESSAGE, TOAST_TYPE, 'my-key');
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  it('should add toasts with different dedupeKeys', () => {
    const { result } = renderHook(() => useToasts(), { wrapper });

    act(() => {
      result.current.addToast(TOAST_MESSAGE, TOAST_TYPE, 'key-a');
      result.current.addToast(TOAST_MESSAGE, TOAST_TYPE, 'key-b');
    });

    expect(result.current.toasts).toHaveLength(2);
  });

  it('should add multiple toasts when no dedupeKey is provided', () => {
    const { result } = renderHook(() => useToasts(), { wrapper });

    act(() => {
      result.current.addToast(TOAST_MESSAGE, TOAST_TYPE);
      result.current.addToast(TOAST_MESSAGE, TOAST_TYPE);
    });

    expect(result.current.toasts).toHaveLength(2);
  });

  it('should allow re-adding a toast after removal with the same dedupeKey', () => {
    const { result } = renderHook(() => useToasts(), { wrapper });

    act(() => {
      result.current.addToast(TOAST_MESSAGE, TOAST_TYPE, 'my-key');
    });

    act(() => {
      result.current.removeToast(result.current.toasts[0].id);
    });

    act(() => {
      result.current.addToast(TOAST_MESSAGE, TOAST_TYPE, 'my-key');
    });

    expect(result.current.toasts).toHaveLength(1);
  });
});
