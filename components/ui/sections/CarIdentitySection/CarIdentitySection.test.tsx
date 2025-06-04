import { render, screen } from '@testing-library/react';

import { CarContext } from '@/context/CarContext';
import { MOCK_CAR } from '@/utils/jest/mocks/general';

import { CAR_IMAGE_TEST_ID } from '../../images/CarImage/CarImage';
import { CarIdentitySection } from './CarIdentitySection';

function TestCarIdentitySection() {
  return (
    <CarContext value={MOCK_CAR}>
      <CarIdentitySection />
    </CarContext>
  );
}

describe('CarIdentitySection', () => {
  it('should render car image.', () => {
    render(<TestCarIdentitySection />);

    const carImage = screen.getByTestId(CAR_IMAGE_TEST_ID);

    expect(carImage).toBeInTheDocument();
  });

  it('should render heading with provided car name', () => {
    render(<TestCarIdentitySection />);

    const carNameHeading = screen.getByRole('heading', {
      name: MOCK_CAR.custom_name,
    });

    expect(carNameHeading).toBeInTheDocument();
  });
});
