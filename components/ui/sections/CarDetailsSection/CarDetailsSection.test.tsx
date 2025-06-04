import { render, screen } from '@testing-library/react';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';
import { CarContext } from '@/context/CarContext';
import { MOCK_CAR } from '@/utils/jest/mocks/general';

import { CAR_DETAILS_TABLE_TEST_ID } from '../../tables/CarDetailsTable/CarDetailsTable';
import { CarDetailsSection } from './CarDetailsSection';

function TestCarDetailsSection({
  isCurrentUserPrimaryOwner = true,
}: {
  isCurrentUserPrimaryOwner?: boolean;
}) {
  return (
    <TanStackQueryProvider>
      <CarContext value={MOCK_CAR}>
        <CarDetailsSection
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        />
      </CarContext>
    </TanStackQueryProvider>
  );
}

describe('CarDetailsSection', () => {
  it('should render heading', () => {
    render(<TestCarDetailsSection />);

    const heading = screen.getByRole('heading', { name: 'Details' });

    expect(heading).toBeInTheDocument();
  });

  it('should render car details table', () => {
    render(<TestCarDetailsSection />);

    const carDetailsTable = screen.getByTestId(CAR_DETAILS_TABLE_TEST_ID);

    expect(carDetailsTable).toBeInTheDocument();
  });

  it('should render section controls', () => {
    render(<TestCarDetailsSection />);

    const editCarButton = screen.getByRole('button', { name: 'edit car' });

    expect(editCarButton).toBeInTheDocument();
  });

  it('edit car button should be disabled if !isCurrentUserPrimaryOwner', () => {
    render(<TestCarDetailsSection isCurrentUserPrimaryOwner={false} />);

    const editCarButton = screen.getByRole('button', { name: 'edit car' });

    expect(editCarButton).toBeDisabled();
  });
});
