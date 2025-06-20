import { render, screen, waitFor } from '@testing-library/react';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';
import { CarOwnership, Profile } from '@/types';

import { CarOwnershipsSection } from './CarOwnershipsSection';
import { CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID } from './CarOwnershipsSectionControls';

const MOCK_CAR_ID = '2c7e021f-fdf7-4a67-aef9-35fa96164864';

const MOCK_MAIN_OWNER_PROFILE: Profile = {
  avatar_url: 'http://some.url',
  id: 'a9132b5f-12d1-4cb6-955c-4e5d1733d1b1',
  username: 'test user',
};

const MOCK_OWNERS_PROFILES: Profile[] = [MOCK_MAIN_OWNER_PROFILE];

const MOCK_OWNERSHIPS: CarOwnership[] = [
  {
    car_id: MOCK_CAR_ID,
    created_at: new Date().toISOString(),
    is_primary_owner: true,
    owner_id: MOCK_MAIN_OWNER_PROFILE.id,
  },
];

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
  it('should render heading', () => {
    render(<TestCarOwnershipsSection />);

    const heading = screen.getByRole('heading', { name: 'Ownerships' });

    expect(heading).toBeInTheDocument();
  });

  it('should render car ownership table', async () => {
    render(<TestCarOwnershipsSection />);

    const carOwnershipsTable = screen.getByRole('table', {
      name: 'car ownerships',
    });

    await waitFor(() => expect(carOwnershipsTable).toBeInTheDocument());
  });

  it('should render section controls', () => {
    render(<TestCarOwnershipsSection />);

    const sectionControls = screen.getByTestId(
      CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID,
    );

    expect(sectionControls).toBeInTheDocument();
  });
});
