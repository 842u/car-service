import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/common/presentation/provider/tan-stack-query';
import {
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
} from '@/user/domain/user/value-objects/name/name.schema';

import { NameForm } from './name';

const MOCK_NAME = 'test name';

function TestNameForm() {
  return (
    <TanStackQueryProvider>
      <NameForm name={MOCK_NAME} />
    </TanStackQueryProvider>
  );
}

describe('NameForm', () => {
  it('should render a name input', async () => {
    render(<TestNameForm />);

    const nameInput = screen.getByRole('textbox', { name: 'Name' });

    await waitFor(() => expect(nameInput).toBeInTheDocument());
  });

  it('should render a form controls', async () => {
    render(<TestNameForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await waitFor(() => expect(resetButton).toBeInTheDocument());
    await waitFor(() => expect(saveButton).toBeInTheDocument());
  });

  it('initially form controls should be disabled', async () => {
    render(<TestNameForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await waitFor(() => expect(resetButton).toBeDisabled());
    await waitFor(() => expect(saveButton).toBeDisabled());
  });

  it('reset button should be enabled on name input change', async () => {
    const inputText = 'test';
    const user = userEvent.setup();
    render(<TestNameForm />);

    const nameInput = screen.getByRole('textbox', { name: 'Name' });
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    await user.type(nameInput, inputText);

    await waitFor(() => expect(resetButton).toBeEnabled());
  });

  it('should reset form on reset button click', async () => {
    const newName = 'new name';
    const user = userEvent.setup();
    render(<TestNameForm />);

    const nameInput = screen.getByRole('textbox', {
      name: 'Name',
    }) as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    await user.clear(nameInput);
    await user.type(nameInput, newName);

    await waitFor(() => expect(nameInput.value).toBe(newName));

    await user.click(resetButton);

    await waitFor(() => expect(nameInput.value).toBe(MOCK_NAME));
  });

  it('submit button should be disabled if wrong name input provided', async () => {
    const baseName = 'a';
    const tooShortName = baseName.repeat(MIN_NAME_LENGTH - 1);
    const tooLongName = baseName.repeat(MAX_NAME_LENGTH + 1);
    const user = userEvent.setup();
    render(<TestNameForm />);

    const nameInput = screen.getByRole('textbox', {
      name: 'Name',
    }) as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.clear(nameInput);
    await user.type(nameInput, tooShortName);

    await waitFor(() => expect(saveButton).toBeDisabled());

    await user.click(resetButton);
    await user.clear(nameInput);
    await user.type(nameInput, tooLongName);

    await waitFor(() => expect(saveButton).toBeDisabled());
  });

  it('submit button should be enabled if correct name input provided', async () => {
    const baseName = 'a';
    const correctName = baseName.repeat(MIN_NAME_LENGTH + 1);
    const user = userEvent.setup();
    render(<TestNameForm />);

    const nameInput = screen.getByRole('textbox', {
      name: 'Name',
    }) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save' });

    await user.clear(nameInput);
    await user.type(nameInput, correctName);

    await waitFor(() => expect(saveButton).toBeEnabled());
  });
});
