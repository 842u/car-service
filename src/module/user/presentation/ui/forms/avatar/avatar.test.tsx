import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

import type { ImageFormData } from '@/common/interface/ui/image-form.schema';

import { AVATAR_FORM_TEST_ID, AvatarForm } from './avatar';

const mockUseAvatarForm = {
  handleFormSubmit: jest.fn(),
  handleImageInputChange: jest.fn(),
  handleFormReset: jest.fn(),
  control: createFormControl(),
  errors: {},
  inputImageUrl: null as string | null,
  isSubmitting: false,
  canReset: false,
  canSubmit: false,
};

function createFormControl() {
  const { result } = renderHook(() =>
    useForm<ImageFormData>({ defaultValues: { image: null } }),
  );

  return result.current.control;
}

jest.mock('./use-avatar', () => ({
  useAvatarForm: () => mockUseAvatarForm,
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAvatarForm.canReset = false;
  mockUseAvatarForm.canSubmit = false;
  mockUseAvatarForm.isSubmitting = false;
  mockUseAvatarForm.inputImageUrl = null;
});

describe('AvatarForm', () => {
  it('should render a file input for avatar', () => {
    render(<AvatarForm />);

    const inputElement = screen.getByLabelText('Avatar');

    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'file');
  });

  it('should render a reset button', () => {
    render(<AvatarForm />);

    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  it('should render a save button', () => {
    render(<AvatarForm />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('should have buttons disabled initially', () => {
    render(<AvatarForm />);

    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('should have buttons enabled when hook returns canReset and canSubmit true', () => {
    mockUseAvatarForm.canReset = true;
    mockUseAvatarForm.canSubmit = true;

    render(<AvatarForm />);

    expect(screen.getByRole('button', { name: 'Reset' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('should call handleFormReset when reset button is clicked', async () => {
    mockUseAvatarForm.canReset = true;

    const user = userEvent.setup();
    render(<AvatarForm />);

    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(mockUseAvatarForm.handleFormReset).toHaveBeenCalledTimes(1);
  });

  it('should call handleFormSubmit when form is submitted', () => {
    render(<AvatarForm />);

    fireEvent.submit(screen.getByTestId(AVATAR_FORM_TEST_ID));

    expect(mockUseAvatarForm.handleFormSubmit).toHaveBeenCalledTimes(1);
  });
});
