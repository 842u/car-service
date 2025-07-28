import { render, screen, waitFor } from '@testing-library/react';
import userEvent, { Options } from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/features/common/providers/tan-stack-query';
import { IMAGE_FILE_MAX_SIZE_BYTES } from '@/schemas/zod/common';
import { updateCurrentSessionProfile } from '@/utils/supabase/tables/profiles';

import { AvatarForm } from './AvatarForm';

const VALID_FILE = new File(['avatar'], 'avatar.png', { type: 'image/png' });
const TOO_BIG_FILE = new File(
  [new ArrayBuffer(IMAGE_FILE_MAX_SIZE_BYTES + 100)],
  'tooBig.png',
  {
    type: 'image/png',
  },
);
const WRONG_TYPE_FILE = new File(['wrong type'], 'wrongType.svg', {
  type: 'image/svg+xml',
});
const USER_EVENT_OPTIONS: Options = { applyAccept: false, delay: 15 };

jest.mock('@/utils/supabase/tables/profiles.ts', () => ({
  updateCurrentSessionProfile: jest.fn(),
}));

function TestAvatarForm() {
  return (
    <TanStackQueryProvider>
      <AvatarForm />
    </TanStackQueryProvider>
  );
}

describe('AvatarForm', () => {
  it('should render a file input for avatar', async () => {
    render(<TestAvatarForm />);

    const inputElement = screen.getByLabelText('Avatar');

    await waitFor(() => {
      expect(inputElement).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(inputElement).toHaveAttribute('type', 'file');
    });
  });

  it('should render a reset button', async () => {
    render(<TestAvatarForm />);

    const resetButtonElement = screen.getByRole('button', { name: 'Reset' });

    await waitFor(() => expect(resetButtonElement).toBeInTheDocument());
  });

  it('reset button should be initially disabled', async () => {
    render(<TestAvatarForm />);

    const resetButtonElement = screen.getByRole('button', { name: 'Reset' });

    await waitFor(() => expect(resetButtonElement).toBeDisabled());
  });

  it('should render a save button', async () => {
    render(<TestAvatarForm />);

    const saveButtonElement = screen.getByRole('button', { name: 'Save' });

    await waitFor(() => expect(saveButtonElement).toBeInTheDocument());
  });

  it('save button should be initially disabled', async () => {
    render(<TestAvatarForm />);

    const saveButtonElement = screen.getByRole('button', { name: 'Save' });

    await waitFor(() => expect(saveButtonElement).toBeDisabled());
  });

  it('buttons should be enabled after selecting a valid file', async () => {
    const user = userEvent.setup(USER_EVENT_OPTIONS);
    render(<TestAvatarForm />);

    const inputElement = screen.getByLabelText('Avatar') as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.upload(inputElement, VALID_FILE);

    await waitFor(() => expect(resetButton).toBeEnabled());
    await waitFor(() => expect(saveButton).toBeEnabled());
  });

  it('save button should be disabled after selecting an invalid file', async () => {
    const user = userEvent.setup(USER_EVENT_OPTIONS);
    render(<TestAvatarForm />);

    const inputElement = screen.getByLabelText('Avatar') as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.upload(inputElement, TOO_BIG_FILE);

    await waitFor(() => expect(resetButton).toBeEnabled());
    await waitFor(() => expect(saveButton).toBeDisabled());

    await user.upload(inputElement, WRONG_TYPE_FILE);

    await waitFor(() => expect(resetButton).toBeEnabled());
    await waitFor(() => expect(saveButton).toBeDisabled());
  });

  it('should call form submit handler and reset form on save button click', async () => {
    const user = userEvent.setup(USER_EVENT_OPTIONS);
    render(<TestAvatarForm />);

    const inputElement = screen.getByLabelText('Avatar') as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.upload(inputElement, VALID_FILE);

    await user.click(saveButton);

    expect(updateCurrentSessionProfile).toHaveBeenCalled();
    await waitFor(() => expect(resetButton).toBeDisabled());
    await waitFor(() => expect(saveButton).toBeDisabled());
  });

  it('should reset form on reset button click', async () => {
    const user = userEvent.setup(USER_EVENT_OPTIONS);
    render(<TestAvatarForm />);

    const inputElement = screen.getByLabelText('Avatar') as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.upload(inputElement, VALID_FILE);

    await waitFor(() => expect(resetButton).toBeEnabled());
    await waitFor(() => expect(saveButton).toBeEnabled());

    await user.click(resetButton);

    await waitFor(() => expect(resetButton).toBeDisabled());
    await waitFor(() => expect(saveButton).toBeDisabled());
  });
});
