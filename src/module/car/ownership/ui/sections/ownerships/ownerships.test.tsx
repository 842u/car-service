import { render, screen, waitFor } from '@testing-library/react';

import { TanStackQueryProvider } from '@/common/presentation/provider/tan-stack-query';
import { createMockCar } from '@/lib/jest/mock/src/module/car/car';
import { createMockCarOwnership } from '@/lib/jest/mock/src/module/car/ownership';
import { createMockUser } from '@/lib/jest/mock/src/module/user/domain/user/user';

import { SECTION_CONTROLS_TEST_ID } from './controls/controls';
import { OwnershipsSection } from './ownerships';

function TestOwnershipsSection() {
  const mockUser = createMockUser();
  const mockCar = createMockCar();
  const mockOwnership = createMockCarOwnership({ owner_id: mockUser.id.value });
  return (
    <TanStackQueryProvider>
      <OwnershipsSection
        carId={mockCar.id}
        carOwnerships={[mockOwnership]}
        isCurrentUserPrimaryOwner={true}
        owners={[]}
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

    const sectionControls = screen.getByTestId(SECTION_CONTROLS_TEST_ID);

    await waitFor(() => expect(sectionControls).toBeInTheDocument());
  });
});
