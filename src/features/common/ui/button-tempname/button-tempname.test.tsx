import { render, screen } from '@testing-library/react';

import { Button } from './button-tempname';

describe('Button', () => {
  it('should render as button element', () => {
    render(<Button>test</Button>);

    const buttonElement = screen.getByRole('button', { name: 'test' });

    expect(buttonElement).toBeInTheDocument();
  });
});
