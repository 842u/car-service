/* eslint testing-library/no-manual-cleanup:0 */

import { cleanup, render, screen } from '@testing-library/react';

import { KeyIcon } from '@/icons/key';
import type { ButtonSizes } from '@/ui/variants/button';

import { IconButton } from './icon-button';

const BUTTON_TITLE = 'test title';

function TestIconButton({
  disabled = false,
  size,
}: {
  disabled?: boolean;
  size?: ButtonSizes;
}) {
  return (
    <IconButton disabled={disabled} size={size} title={BUTTON_TITLE}>
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

  it('should default to the compact size', () => {
    render(<TestIconButton />);

    const buttonElement = screen.getByRole('button', { name: BUTTON_TITLE });

    expect(buttonElement).toHaveClass('h-10 px-3 py-1');
  });

  it('should render the compact size when passed explicitly', () => {
    render(<TestIconButton size="compact" />);

    const buttonElement = screen.getByRole('button', { name: BUTTON_TITLE });

    expect(buttonElement).toHaveClass('h-10 px-3 py-1');
  });
});
