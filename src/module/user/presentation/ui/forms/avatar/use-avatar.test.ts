import '@/lib/jest/mock/globalThis/URL/createObjectURL';

import { act, renderHook, waitFor } from '@testing-library/react';
import { useController } from 'react-hook-form';

import type { ImageFormData } from '@/common/interface/ui/image-form.schema';

import { useAvatarForm } from './use-avatar';

const mockMutateAsync = jest.fn();

jest.mock('./use-avatar-change', () => ({
  useUserAvatarChange: () => ({ mutateAsync: mockMutateAsync }),
}));

const mockEnqueueRevokeObjectUrl = jest.fn();

jest.mock('@/lib/general', () => ({
  enqueueRevokeObjectUrl: (...args: unknown[]) =>
    mockEnqueueRevokeObjectUrl(...args),
}));

const VALID_FILE = new File(['avatar'], 'avatar.png', { type: 'image/png' });

/**
 * Helper that renders useAvatarForm alongside a useController
 * to programmatically set form field values through react-hook-form's control.
 */
function useAvatarFormWithField() {
  const form = useAvatarForm();
  const { field } = useController<ImageFormData>({
    control: form.control,
    name: 'image',
  });

  return { ...form, field };
}

/**
 * Renders useAvatarForm and flushes react-hook-form's
 * async schema validation to avoid act() warnings.
 */
async function renderAvatarFormHook() {
  const { result } = renderHook(() => useAvatarForm());
  await waitFor(() => expect(result.current).toBeDefined());

  return { result };
}

/**
 * Renders useAvatarFormWithField and flushes react-hook-form's
 * async schema validation to avoid act() warnings.
 */
async function renderAvatarFormWithFieldHook() {
  const { result } = renderHook(() => useAvatarFormWithField());
  await waitFor(() => expect(result.current).toBeDefined());

  return { result };
}

beforeEach(() => {
  jest.clearAllMocks();
  (URL.createObjectURL as jest.Mock).mockReturnValue('blob:test/12345678');
});

describe('useAvatarForm', () => {
  it('should have canReset as false initially', async () => {
    const { result } = await renderAvatarFormHook();

    expect(result.current.canReset).toBe(false);
  });

  it('should have canSubmit as false initially', async () => {
    const { result } = await renderAvatarFormHook();

    expect(result.current.canSubmit).toBe(false);
  });

  it('should call URL.createObjectURL and update inputImageUrl when file is provided', async () => {
    const { result } = await renderAvatarFormHook();

    act(() => {
      result.current.handleImageInputChange(VALID_FILE);
    });

    expect(URL.createObjectURL).toHaveBeenCalledWith(VALID_FILE);
    expect(result.current.inputImageUrl).toBe('blob:test/12345678');
  });

  it('should clear inputImageUrl when null is provided', async () => {
    const { result } = await renderAvatarFormHook();

    act(() => {
      result.current.handleImageInputChange(VALID_FILE);
    });

    expect(result.current.inputImageUrl).toBe('blob:test/12345678');

    act(() => {
      result.current.handleImageInputChange(null);
    });

    expect(result.current.inputImageUrl).toBeNull();
  });

  it('should revoke previous object URL when changing files', async () => {
    const { result } = await renderAvatarFormHook();

    act(() => {
      result.current.handleImageInputChange(VALID_FILE);
    });

    const newFile = new File(['new'], 'new.png', { type: 'image/png' });
    (URL.createObjectURL as jest.Mock).mockReturnValue('blob:test/new');

    act(() => {
      result.current.handleImageInputChange(newFile);
    });

    expect(mockEnqueueRevokeObjectUrl).toHaveBeenCalledWith(
      'blob:test/12345678',
    );
  });

  it('should reset form with handleFormReset', async () => {
    const { result } = await renderAvatarFormWithFieldHook();

    await act(async () => {
      result.current.field.onChange(VALID_FILE);
    });

    act(() => {
      result.current.handleFormReset();
    });

    expect(result.current.canReset).toBe(false);
    expect(result.current.canSubmit).toBe(false);
  });

  it('should call mutateAsync with file and imageInputUrl on submit', async () => {
    mockMutateAsync.mockResolvedValue({});

    const { result } = await renderAvatarFormWithFieldHook();

    act(() => {
      result.current.handleImageInputChange(VALID_FILE);
    });

    await act(async () => {
      result.current.field.onChange(VALID_FILE);
    });

    await act(async () => {
      await result.current.handleFormSubmit();
    });

    expect(mockMutateAsync).toHaveBeenCalledWith({
      image: VALID_FILE,
      imageInputUrl: 'blob:test/12345678',
    });
  });

  it('should have canReset true when form is dirty and not submitting', async () => {
    const { result } = await renderAvatarFormWithFieldHook();

    await act(async () => {
      result.current.field.onChange(VALID_FILE);
    });

    expect(result.current.canReset).toBe(true);
  });

  it('should have canSubmit true when form is valid, dirty, and not submitting', async () => {
    const { result } = await renderAvatarFormWithFieldHook();

    await act(async () => {
      result.current.field.onChange(VALID_FILE);
    });

    expect(result.current.canSubmit).toBe(true);
  });

  it('should auto-reset form after successful submission', async () => {
    mockMutateAsync.mockResolvedValue({});

    const { result } = await renderAvatarFormWithFieldHook();

    await act(async () => {
      result.current.field.onChange(VALID_FILE);
    });

    await act(async () => {
      await result.current.handleFormSubmit();
    });

    expect(result.current.canReset).toBe(false);
    expect(result.current.canSubmit).toBe(false);
  });
});
