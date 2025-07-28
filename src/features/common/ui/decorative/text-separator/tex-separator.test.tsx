import { render, screen } from '@testing-library/react';

import { TextSeparator } from './text-separator';

describe('TextSeparator', () => {
  it('should render provided text', () => {
    const text = 'some text';

    render(<TextSeparator text={text} />);

    const renderedText = screen.getByText(/text/i);

    expect(renderedText).toBeInTheDocument();
  });

  it('should render empty element if no text provided', () => {
    render(<TextSeparator />);

    const separator = screen.getByTestId('text-separator');

    expect(separator).toBeEmptyDOMElement();
  });
});
