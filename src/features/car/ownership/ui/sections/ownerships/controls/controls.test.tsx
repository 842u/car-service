import { render, screen } from '@testing-library/react';

import { ADD_FORM_TEST_ID } from '@/car/ownership/ui/forms/add/add';
import { TanStackQueryProvider } from '@/common/providers/tan-stack-query';

import { SectionControls } from './controls';

const MOCK_CAR_ID = 'ee4a8fa7-758e-4302-8726-01eeecee8707';

function TestSectionControls({
  isCurrentUserPrimaryOwner = true,
}: {
  isCurrentUserPrimaryOwner?: boolean;
}) {
  return (
    <TanStackQueryProvider>
      <SectionControls
        carId={MOCK_CAR_ID}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </TanStackQueryProvider>
  );
}

describe('SectionControls', () => {
  it('should render a button for adding ownership', () => {
    render(<TestSectionControls />);

    const addOwnershipButton = screen.getByRole('button', {
      name: 'Add owner',
    });

    expect(addOwnershipButton).toBeInTheDocument();
  });

  it('add ownership button should be disabled if !isCurrentUserPrimaryOwner', () => {
    render(<TestSectionControls isCurrentUserPrimaryOwner={false} />);

    const addOwnershipButton = screen.getByRole('button', {
      name: 'Add owner',
    });

    expect(addOwnershipButton).toBeDisabled();
  });

  it('should render a car ownership add form', () => {
    render(<TestSectionControls />);

    const carOwnershipAddForm = screen.getByTestId(ADD_FORM_TEST_ID);

    expect(carOwnershipAddForm).toBeInTheDocument();
  });
});
