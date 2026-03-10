import { render, screen } from '@testing-library/react';

import { DETAILS_TABLE_TEST_ID } from '@/car/ui/tables/details/details';
import { TanStackQueryProvider } from '@/common/presentation/provider/tan-stack-query';
import { createMockCar } from '@/lib/jest/mock/src/module/car/car';

import { DetailsSection } from './details';

function TestDetailsSection({
  isCurrentUserPrimaryOwner = true,
}: {
  isCurrentUserPrimaryOwner?: boolean;
}) {
  const mockCar = createMockCar();

  return (
    <TanStackQueryProvider>
      <DetailsSection
        carData={mockCar}
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
