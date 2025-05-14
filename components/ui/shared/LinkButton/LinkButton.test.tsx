import { render, screen } from '@testing-library/react';

import { LinkButton } from './LinkButton';

describe('LinkButton', () => {
  it('should render as a link element', () => {
    const textContent = 'test';
    const href = 'http://test.url';
    render(<LinkButton href={href}>{textContent}</LinkButton>);

    const linkElement = screen.getByRole('link', { name: textContent });

    expect(linkElement).toBeInTheDocument();
  });

  it('should have proper href value', () => {
    const textContent = 'test';
    const href = 'http://test.url';
    render(<LinkButton href={href}>{textContent}</LinkButton>);

    const linkElement = screen.getByRole('link', { name: textContent });

    expect(linkElement).toHaveAttribute('href', href);
  });
});
