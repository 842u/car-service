import { render, screen } from '@testing-library/react';

import { DETAILS_TABLE_TEST_ID } from '@/car/ui/tables/details/details';
import { TanStackQueryProvider } from '@/common/providers/tan-stack-query';
import { Car } from '@/types';

import { DetailsSection } from './details';

const MOCK_CAR_ID = 'e5e42160-6e96-4641-8484-b851aec4167f';
const MOCK_CAR_DATA: Car = {
  additional_fuel_type: null,
  brand: null,
  created_at: null,
  created_by: null,
  custom_name: 'test name',
  drive_type: null,
  engine_capacity: null,
  fuel_type: null,
  id: MOCK_CAR_ID,
  image_url: null,
  insurance_expiration: null,
  license_plates: null,
  mileage: null,
  model: null,
  production_year: null,
  technical_inspection_expiration: null,
  transmission_type: null,
  vin: null,
};

function TestDetailsSection({
  isCurrentUserPrimaryOwner = true,
}: {
  isCurrentUserPrimaryOwner?: boolean;
}) {
  return (
    <TanStackQueryProvider>
      <DetailsSection
        carData={MOCK_CAR_DATA}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </TanStackQueryProvider>
  );
}

describe('DetailsSection', () => {
  it('should render heading', () => {
    render(<TestDetailsSection />);

    const heading = screen.getByRole('heading', { name: 'Details' });

    expect(heading).toBeInTheDocument();
  });

  it('should render car details table', () => {
    render(<TestDetailsSection />);

    const carDetailsTable = screen.getByTestId(DETAILS_TABLE_TEST_ID);

    expect(carDetailsTable).toBeInTheDocument();
  });

  it('should render section controls', () => {
    render(<TestDetailsSection />);

    const editCarButton = screen.getByRole('button', { name: 'Edit car' });

    expect(editCarButton).toBeInTheDocument();
  });

  it('edit car button should be disabled if !isCurrentUserPrimaryOwner', () => {
    render(<TestDetailsSection isCurrentUserPrimaryOwner={false} />);

    const editCarButton = screen.getByRole('button', { name: 'Edit car' });

    expect(editCarButton).toBeDisabled();
  });
});
