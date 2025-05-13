import { render, screen } from '@testing-library/react';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';

import { CarOwnershipSection } from './CarOwnershipSection';
import { CAR_OWNERSHIP_SECTION_CONTROLS_TEST_ID } from './CarOwnershipSectionControls';

const MOCK_CAR_ID = '2c7e021f-fdf7-4a67-aef9-35fa96164864';

function TestCarOwnershipSection() {
  return (
    <TanStackQueryProvider>
      <CarOwnershipSection
        carId={MOCK_CAR_ID}
        isCurrentUserPrimaryOwner={true}
      />
    </TanStackQueryProvider>
  );
}

describe('CarOwnershipSection', () => {
  it('should render heading', () => {
    render(<TestCarOwnershipSection />);

    const heading = screen.getByRole('heading', { name: 'Ownership' });

    expect(heading).toBeInTheDocument();
  });

  it('should render car ownership table', () => {
    render(<TestCarOwnershipSection />);

    const carOwnershipTable = screen.getByRole('table', {
      name: 'car ownership table',
    });

    expect(carOwnershipTable).toBeInTheDocument();
  });

  it('should render section controls', () => {
    render(<TestCarOwnershipSection />);

    const sectionControls = screen.getByTestId(
      CAR_OWNERSHIP_SECTION_CONTROLS_TEST_ID,
    );

    expect(sectionControls).toBeInTheDocument();
  });
});
