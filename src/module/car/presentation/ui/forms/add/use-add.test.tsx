import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';

import type { CarFormData } from '@/car/interface/ui/car-form.schema';

import { useAddForm } from './use-add';

const mockAddToast = jest.fn();
jest.mock('@/common/presentation/hook/use-toasts', () => ({
  useToasts: () => ({ addToast: mockAddToast }),
}));

const mockAddMutationFn = jest.fn();
const mockAddOnSuccess = jest.fn();
const mockAddOnError = jest.fn();
jest.mock('@/car/presentation/tanstack/mutation/add', () => ({
  get carAddMutationOptions() {
    return {
      mutationFn: mockAddMutationFn,
      onSuccess: mockAddOnSuccess,
      onError: mockAddOnError,
    };
  },
}));

const mockEditMutationFn = jest.fn();
jest.mock('@/car/presentation/tanstack/mutation/edit', () => ({
  get carEditMutationOptions() {
    return { mutationFn: mockEditMutationFn };
  },
}));

let queryClient: QueryClient;

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
});

const formData = { customName: 'New Car' } as CarFormData;

describe('useAddForm', () => {
  it('shows a success toast and forwards to the mutation options base onSuccess', async () => {
    mockAddMutationFn.mockResolvedValue({
      id: 'car-1',
      customName: 'New Car',
    });

    const { result } = renderHook(() => useAddForm({ onSubmit: undefined }), {
      wrapper,
    });

    await result.current.handleFormSubmit(formData);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        'Car New Car added.',
        'success',
      );
    });

    expect(mockAddOnSuccess).toHaveBeenCalledWith(
      { id: 'car-1', customName: 'New Car' },
      expect.objectContaining({ customName: 'New Car' }),
      undefined,
      expect.anything(),
    );
  });

  it('shows an error toast and forwards to the mutation options base onError', async () => {
    const error = new Error('Add failed');
    mockAddMutationFn.mockRejectedValue(error);

    const { result } = renderHook(() => useAddForm({ onSubmit: undefined }), {
      wrapper,
    });

    await result.current.handleFormSubmit(formData);

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('Add failed', 'error');
    });

    expect(mockAddOnError).toHaveBeenCalledWith(
      error,
      expect.objectContaining({ customName: 'New Car' }),
      undefined,
      expect.anything(),
    );
  });
});
