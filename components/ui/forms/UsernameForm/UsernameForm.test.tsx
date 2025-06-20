import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/schemas/zod/common';
import { updateCurrentSessionProfile } from '@/utils/supabase/tables/profiles';

import { UsernameForm } from './UsernameForm';

jest.mock('@/utils/supabase/tables/profiles', () => ({
  updateCurrentSessionProfile: jest.fn(),
}));

jest.mock('@/utils/tanstack/profiles', () => ({
  profilesUpdateOnMutate: jest.fn(),
}));

const MOCK_USERNAME = 'test username';

function TestUsernameForm() {
  return (
    <TanStackQueryProvider>
      <UsernameForm username={MOCK_USERNAME} />
    </TanStackQueryProvider>
  );
}

describe('UsernameForm', () => {
  it('should render a username input', async () => {
    render(<TestUsernameForm />);

    const usernameInput = screen.getByRole('textbox', { name: 'Username' });

    await waitFor(() => expect(usernameInput).toBeInTheDocument());
  });

  it('should render a form controls', async () => {
    render(<TestUsernameForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await waitFor(() => expect(resetButton).toBeInTheDocument());
    await waitFor(() => expect(saveButton).toBeInTheDocument());
  });

  it('initially form controls should be disabled', async () => {
    render(<TestUsernameForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await waitFor(() => expect(resetButton).toBeDisabled());
    await waitFor(() => expect(saveButton).toBeDisabled());
  });

  it('reset button should be enabled on username input change', async () => {
    const inputText = 'test';
    const user = userEvent.setup();
    render(<TestUsernameForm />);

    const usernameInput = screen.getByRole('textbox', { name: 'Username' });
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    await user.type(usernameInput, inputText);

    await waitFor(() => expect(resetButton).toBeEnabled());
  });

  it('should reset form on reset button click', async () => {
    const newUsername = 'new username';
    const user = userEvent.setup();
    render(<TestUsernameForm />);

    const usernameInput = screen.getByRole('textbox', {
      name: 'Username',
    }) as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    await user.clear(usernameInput);
    await user.type(usernameInput, newUsername);

    await waitFor(() => expect(usernameInput.value).toBe(newUsername));

    await user.click(resetButton);

    await waitFor(() => expect(usernameInput.value).toBe(MOCK_USERNAME));
  });

  it('submit button should be disabled if wrong username input provided', async () => {
    const baseUsername = 'a';
    const tooShortUsername = baseUsername.repeat(MIN_USERNAME_LENGTH - 1);
    const tooLongUsername = baseUsername.repeat(MAX_USERNAME_LENGTH + 1);
    const user = userEvent.setup();
    render(<TestUsernameForm />);

    const usernameInput = screen.getByRole('textbox', {
      name: 'Username',
    }) as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.clear(usernameInput);
    await user.type(usernameInput, tooShortUsername);

    await waitFor(() => expect(saveButton).toBeDisabled());

    await user.click(resetButton);
    await user.clear(usernameInput);
    await user.type(usernameInput, tooLongUsername);

    await waitFor(() => expect(saveButton).toBeDisabled());
  });

  it('submit button should be enabled if correct username input provided', async () => {
    const baseUsername = 'a';
    const correctUsername = baseUsername.repeat(MIN_USERNAME_LENGTH + 1);
    const user = userEvent.setup();
    render(<TestUsernameForm />);

    const usernameInput = screen.getByRole('textbox', {
      name: 'Username',
    }) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.clear(usernameInput);
    await user.type(usernameInput, correctUsername);

    await waitFor(() => expect(saveButton).toBeEnabled());
  });

  it('should call proper submit handler on submit', async () => {
    const baseUsername = 'a';
    const correctUsername = baseUsername.repeat(MIN_USERNAME_LENGTH + 1);
    const user = userEvent.setup();
    render(<TestUsernameForm />);

    const usernameInput = screen.getByRole('textbox', {
      name: 'Username',
    }) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.clear(usernameInput);
    await user.type(usernameInput, correctUsername);
    await user.click(saveButton);

    await waitFor(() =>
      expect(updateCurrentSessionProfile).toHaveBeenCalledWith({
        property: 'username',
        value: correctUsername,
      }),
    );
  });
});
