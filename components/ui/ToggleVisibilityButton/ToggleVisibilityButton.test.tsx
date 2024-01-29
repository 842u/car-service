import { render, screen } from '@testing-library/react';

import { ToggleVisibilityButton } from './ToggleVisibilityButton';

describe('ToggleVisibilityButton', () => {
  it('should render button', () => {
    render(<ToggleVisibilityButton />);
    const button = screen.getByRole('button', { name: 'toggle visibility' });

    expect(button).toBeInTheDocument();
  });

  it('should render eye icon while visibility = false', () => {
    const isVisible = false;

    render(<ToggleVisibilityButton isVisible={isVisible} />);
    const eyeIcon = screen.getByTestId('eye-icon');

    expect(eyeIcon).toBeInTheDocument();
  });

  it('should render eye slash icon while visibility = true', () => {
    const isVisible = true;

    render(<ToggleVisibilityButton isVisible={isVisible} />);
    const eyeSlashIcon = screen.getByTestId('eye-slash-icon');

    expect(eyeSlashIcon).toBeInTheDocument();
  });
});
