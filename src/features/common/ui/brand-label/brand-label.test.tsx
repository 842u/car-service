import { render, screen } from '@testing-library/react';

import { BRAND_SIMPLE_ICON_TEST_ID } from '@/icons/brand-simple';
import { BrandLabel } from '@/ui/brand-label/brand-label';

describe('BrandLabel', () => {
  it('should render as <a> element', () => {
    render(<BrandLabel />);

    const link = screen.getByRole('link', { name: 'Car Service - Home' });

    expect(link).toBeInTheDocument();
  });

  it('should render a brand logo', () => {
    render(<BrandLabel />);

    const logo = screen.getByTestId(BRAND_SIMPLE_ICON_TEST_ID);

    expect(logo).toBeInTheDocument();
  });

  it('should render a brand name', () => {
    render(<BrandLabel />);

    const brandName = screen.getByText('Car Service');

    expect(brandName).toBeInTheDocument();
  });
});
