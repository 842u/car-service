import { render, screen } from '@testing-library/react';

import { VisibilityButton } from './VisibilityButton';

describe('VisibilityButton', () => {
  it('should render button', () => {
    render(<VisibilityButton />);
    const button = screen.getByRole('button', { name: 'toggle visibility' });

    expect(button).toBeInTheDocument();
  });

  it('should render eye icon while visibility = false', () => {
    const isVisible = false;

    render(<VisibilityButton isVisible={isVisible} />);
    const eyeIcon = screen.getByTestId('eye-icon');

    expect(eyeIcon).toBeInTheDocument();
  });

  it('should render eye slash icon while visibility = true', () => {
    const isVisible = true;

    render(<VisibilityButton isVisible={isVisible} />);
    const eyeSlashIcon = screen.getByTestId('eye-slash-icon');

    expect(eyeSlashIcon).toBeInTheDocument();
  });
});
