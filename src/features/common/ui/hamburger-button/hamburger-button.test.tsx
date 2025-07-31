import { render, screen } from '@testing-library/react';

import { HamburgerButton } from './hamburger-button';

describe('HamburgerButton', () => {
  it('should render as button', () => {
    render(<HamburgerButton />);

    const button = screen.getByRole('button', {
      name: 'toggle navigation menu',
    });

    expect(button).toBeInTheDocument();
  });
});
