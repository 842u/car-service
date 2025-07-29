import { render, screen, waitFor } from '@testing-library/react';

import { TanStackQueryProvider } from '@/common/providers/tan-stack-query';
import {
  MOCK_CAR_ID,
  MOCK_OWNERS_PROFILES,
  MOCK_OWNERSHIPS,
} from '@/utils/jest/mocks/supabase';

import { CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID } from './controls/controls';
import { OwnershipsSection } from './ownerships';

function TestOwnershipsSection() {
  return (
    <TanStackQueryProvider>
      <OwnershipsSection
        carId={MOCK_CAR_ID}
        carOwnerships={MOCK_OWNERSHIPS}
        isCurrentUserPrimaryOwner={true}
        ownersProfiles={MOCK_OWNERS_PROFILES}
      />
    </TanStackQueryProvider>
  );
}

describe('OwnershipsSection', () => {
  it('should render heading', async () => {
    render(<TestOwnershipsSection />);

    const heading = screen.getByRole('heading', { name: 'Ownerships' });

    await waitFor(() => expect(heading).toBeInTheDocument());
  });

  it('should render car ownership table', async () => {
    render(<TestOwnershipsSection />);

    const carOwnershipsTable = screen.getByRole('table', {
      name: 'car ownerships',
    });

    await waitFor(() => expect(carOwnershipsTable).toBeInTheDocument());
  });

  it('should render section controls', async () => {
    render(<TestOwnershipsSection />);

    const sectionControls = screen.getByTestId(
      CAR_OWNERSHIPS_SECTION_CONTROLS_TEST_ID,
    );

    await waitFor(() => expect(sectionControls).toBeInTheDocument());
  });
});
