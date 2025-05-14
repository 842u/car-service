/* eslint testing-library/no-manual-cleanup:0 */

import { cleanup, render, screen } from '@testing-library/react';

import { KeyIcon } from '@/components/decorative/icons/KeyIcon';

import { IconButton } from './IconButton';

const BUTTON_TITLE = 'test title';

function TestIconButton({ disabled = false }: { disabled?: boolean }) {
  return (
    <IconButton disabled={disabled} title={BUTTON_TITLE}>
      <KeyIcon />
    </IconButton>
  );
}

describe('IconButton', () => {
  it('should render as a button element', () => {
    render(<TestIconButton />);

    const buttonElement = screen.getByRole('button', { name: BUTTON_TITLE });

    expect(buttonElement).toBeInTheDocument();
  });

  it('should respect "disabled" prop', () => {
    render(<TestIconButton />);

    let buttonElement = screen.getByRole('button', { name: BUTTON_TITLE });

    expect(buttonElement).toBeEnabled();

    cleanup();

    render(<TestIconButton disabled={true} />);

    buttonElement = screen.getByRole('button', { name: BUTTON_TITLE });

    expect(buttonElement).toBeDisabled();
  });
});
