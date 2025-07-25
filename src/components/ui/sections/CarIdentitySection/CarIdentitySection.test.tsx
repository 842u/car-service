import { render, screen } from '@testing-library/react';

import { SPINNER_TEST_ID } from '@/components/decorative/Spinner/Spinner';

import { CarIdentitySection } from './CarIdentitySection';

const MOCK_CAR_IMAGE_URL = 'http://some.url';
const MOCK_CAR_NAME = 'test';

describe('CarIdentitySection', () => {
  it('should render loading spinner if isPending', () => {
    render(<CarIdentitySection isPending />);

    const spinner = screen.getByTestId(SPINNER_TEST_ID);

    expect(spinner).toBeInTheDocument();
  });

  it('should render car image if !isPending', () => {
    render(
      <CarIdentitySection imageUrl={MOCK_CAR_IMAGE_URL} isPending={false} />,
    );

    const carImage = screen.getByRole('img', { name: 'car image' });

    expect(carImage).toBeInTheDocument();
  });

  it('should render heading with provided car name', () => {
    render(<CarIdentitySection name={MOCK_CAR_NAME} />);

    const carNameHeading = screen.getByRole('heading', { name: MOCK_CAR_NAME });

    expect(carNameHeading).toBeInTheDocument();
  });
});
