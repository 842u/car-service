/* eslint jsx-a11y/alt-text:0 */

import { render, screen } from '@testing-library/react';

import { BRAND_FULL_ICON_TEST_ID } from '@/icons/brand-full';

import { Image } from './image';

const MOCK_SRC = 'http://test.url';

describe('Image', () => {
  it('should render a default icon if no src is provided', () => {
    render(<Image />);

    const defaultIcon = screen.getByTestId(BRAND_FULL_ICON_TEST_ID);

    expect(defaultIcon).toBeInTheDocument();
  });

  it('should render an image if src is provided', () => {
    render(<Image src={MOCK_SRC} />);

    const image = screen.getByRole('img', { name: 'car image' });

    expect(image).toBeInTheDocument();
  });
});
