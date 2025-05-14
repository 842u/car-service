import { render, screen } from '@testing-library/react';

import { HamburgerButton } from './HamburgerButton';

describe('HamburgerButton', () => {
  it('should render as button', () => {
    render(<HamburgerButton />);

    const button = screen.getByRole('button', {
      name: 'toggle navigation menu',
    });

    expect(button).toBeInTheDocument();
  });
});
