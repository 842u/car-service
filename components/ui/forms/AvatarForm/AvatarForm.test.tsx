import { render, screen, waitFor } from '@testing-library/react';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';

import { AvatarForm } from './AvatarForm';

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
});
