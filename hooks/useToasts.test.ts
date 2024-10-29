import { act, renderHook } from '@testing-library/react';

import { Toast } from '@/types';

import { useToasts } from './useToasts';

crypto.randomUUID = jest.fn();

const firstToast: Toast = {
  id: 'id_1',
  message: 'toast_1',
  type: 'info',
};
const secondToast: Toast = {
  id: 'id_2',
  message: 'toast_2',
  type: 'info',
};
const thirdToast: Toast = {
  id: 'id_3',
  message: 'toast_3',
  type: 'info',
};

describe('useToasts', () => {
  it('initially should have no toasts', () => {
    const { result } = renderHook(useToasts);

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should add toast on addToast call', () => {
    (crypto.randomUUID as jest.Mock).mockReturnValueOnce(firstToast.id);
    const { result } = renderHook(useToasts);

    act(() => result.current.addToast(firstToast.message, firstToast.type));

    expect(result.current.toasts).toHaveLength(1);
  });

  it('should remove toast on removeToast call', () => {
    (crypto.randomUUID as jest.Mock).mockReturnValueOnce(firstToast.id);
    const { result } = renderHook(useToasts);

    act(() => result.current.addToast(firstToast.message, firstToast.type));
    act(() => result.current.removeToast(firstToast.id));

    expect(result.current.toasts).toHaveLength(0);
  });

  it('should add multiple toasts correctly', () => {
    (crypto.randomUUID as jest.Mock)
      .mockReturnValueOnce(firstToast.id)
      .mockReturnValueOnce(secondToast.id);
    const { result } = renderHook(useToasts);

    act(() => {
      result.current.addToast(firstToast.message, firstToast.type);
      result.current.addToast(secondToast.message, secondToast.type);
    });

    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts[0].id).toBe(firstToast.id);
    expect(result.current.toasts[1].id).toBe(secondToast.id);
  });

  it('should remove toasts correctly', () => {
    (crypto.randomUUID as jest.Mock)
      .mockReturnValueOnce(firstToast.id)
      .mockReturnValueOnce(secondToast.id)
      .mockReturnValueOnce(thirdToast.id);
    const { result } = renderHook(useToasts);

    act(() => {
      result.current.addToast(firstToast.message, firstToast.type);
      result.current.addToast(secondToast.message, secondToast.type);
      result.current.addToast(thirdToast.message, thirdToast.type);
      result.current.removeToast(secondToast.id);
    });

    expect(result.current.toasts).toHaveLength(2);
    expect(result.current.toasts[0].id).toBe(firstToast.id);
    expect(result.current.toasts[1].id).toBe(thirdToast.id);
  });
});
