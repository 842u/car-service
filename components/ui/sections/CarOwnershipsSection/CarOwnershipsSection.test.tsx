import { render, screen } from '@testing-library/react';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';

import { CarOwnershipsSection } from './CarOwnershipsSection';
import { CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID } from './CarOwnershipsSectionControls';

const MOCK_CAR_ID = '2c7e021f-fdf7-4a67-aef9-35fa96164864';

function TestCarOwnershipsSection() {
  return (
    <TanStackQueryProvider>
      <CarOwnershipsSection
        carId={MOCK_CAR_ID}
        isCurrentUserPrimaryOwner={true}
      />
    </TanStackQueryProvider>
  );
}

describe('CarOwnershipsSection', () => {
  it('should render heading', () => {
    render(<TestCarOwnershipsSection />);

    const heading = screen.getByRole('heading', { name: 'Ownership' });

    expect(heading).toBeInTheDocument();
  });

  it('should render car ownership table', () => {
    render(<TestCarOwnershipsSection />);

    const carOwnershipsTable = screen.getByRole('table', {
      name: 'car ownership table',
    });

    expect(carOwnershipsTable).toBeInTheDocument();
  });

  it('should render section controls', () => {
    render(<TestCarOwnershipsSection />);

    const sectionControls = screen.getByTestId(
      CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID,
    );

    expect(sectionControls).toBeInTheDocument();
  });
});
