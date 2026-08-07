import { render, screen } from '@testing-library/react';

import { TruncatedText } from './truncated-text';

const MOCK_TEXT = 'a very long value that does not fit';

describe('TruncatedText', () => {
  it('should put the full text in the tooltip', () => {
    render(<TruncatedText text={MOCK_TEXT} />);

    expect(screen.getByText(MOCK_TEXT)).toHaveAttribute('title', MOCK_TEXT);
  });

  it('should render a numeric text and its tooltip', () => {
    render(<TruncatedText text={0} />);

    expect(screen.getByText('0')).toHaveAttribute('title', '0');
  });

  it('should render the fallback and no tooltip if there is no text', () => {
    render(<TruncatedText fallback="---" text={null} />);

    expect(screen.getByText('---')).not.toHaveAttribute('title');
  });
});
