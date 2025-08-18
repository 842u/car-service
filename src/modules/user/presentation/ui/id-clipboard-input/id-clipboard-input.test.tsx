import { render, screen } from '@testing-library/react';

import { IdClipboardInput } from './id-clipboard-input';

const MOCK_ID = '797ac92c-e9b1-4ce4-b146-a62e8f2193a4';

describe('IdClipboardInput', () => {
  it('should render an input element', () => {
    render(<IdClipboardInput />);

    const inputElement = screen.getByRole('textbox', {
      name: 'current user ID',
    });

    expect(inputElement).toBeInTheDocument();
  });

  it('should be read only', () => {
    render(<IdClipboardInput />);

    const inputElement = screen.getByRole('textbox', {
      name: 'current user ID',
    });

    expect(inputElement).toHaveAttribute('readonly');
  });

  it('should display provided id', () => {
    render(<IdClipboardInput id={MOCK_ID} />);

    const inputElement = screen.getByRole('textbox', {
      name: 'current user ID',
    }) as HTMLInputElement;

    expect(inputElement.value).toBe(MOCK_ID);
  });
});
