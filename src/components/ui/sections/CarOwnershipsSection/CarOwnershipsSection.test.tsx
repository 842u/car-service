import { render, screen, waitFor } from '@testing-library/react';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';
import {
  MOCK_CAR_ID,
  MOCK_OWNERS_PROFILES,
  MOCK_OWNERSHIPS,
} from '@/utils/jest/mocks/supabase';

import { CarOwnershipsSection } from './CarOwnershipsSection';
import { CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID } from './CarOwnershipsSectionControls/CarOwnershipsSectionControls';

function TestCarOwnershipsSection() {
  return (
    <TanStackQueryProvider>
      <CarOwnershipsSection
        carId={MOCK_CAR_ID}
        carOwnerships={MOCK_OWNERSHIPS}
        isCurrentUserPrimaryOwner={true}
        ownersProfiles={MOCK_OWNERS_PROFILES}
      />
    </TanStackQueryProvider>
  );
}

describe('CarOwnershipsSection', () => {
  it('should render heading', async () => {
    render(<TestCarOwnershipsSection />);

    const heading = screen.getByRole('heading', { name: 'Ownerships' });

    await waitFor(() => expect(heading).toBeInTheDocument());
  });

  it('should render car ownership table', async () => {
    render(<TestCarOwnershipsSection />);

    const carOwnershipsTable = screen.getByRole('table', {
      name: 'car ownerships',
    });

    await waitFor(() => expect(carOwnershipsTable).toBeInTheDocument());
  });

  it('should render section controls', async () => {
    render(<TestCarOwnershipsSection />);

    const sectionControls = screen.getByTestId(
      CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID,
    );

    await waitFor(() => expect(sectionControls).toBeInTheDocument());
  });
});
