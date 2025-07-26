import { render, screen } from '@testing-library/react';

import { BRAND_FULL_ICON_TEST_ID } from '@/features/common/ui/decorative/icons/BrandFullIcon';

import { CarImage } from './CarImage';

const MOCK_SRC = 'http://test.url';

describe('CarImage', () => {
  it('should render a default icon if no src is provided', () => {
    render(<CarImage />);

    const defaultIcon = screen.getByTestId(BRAND_FULL_ICON_TEST_ID);

    expect(defaultIcon).toBeInTheDocument();
  });

  it('should render an image if src is provided', () => {
    render(<CarImage src={MOCK_SRC} />);

    const image = screen.getByRole('img', { name: 'car image' });

    expect(image).toBeInTheDocument();
  });
});
