import { render, screen } from '@testing-library/react';

import { CAR_OWNERSHIP_ADD_FORM_TEST_ID } from '@/car/ownership/ui/forms/add/add';
import { TanStackQueryProvider } from '@/common/providers/tan-stack-query';

import { Controls } from './controls';

const MOCK_CAR_ID = 'ee4a8fa7-758e-4302-8726-01eeecee8707';

function TestControls({
  isCurrentUserPrimaryOwner = true,
}: {
  isCurrentUserPrimaryOwner?: boolean;
}) {
  return (
    <TanStackQueryProvider>
      <Controls
        carId={MOCK_CAR_ID}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </TanStackQueryProvider>
  );
}

describe('Controls', () => {
  it('should render a button for adding ownership', () => {
    render(<TestControls />);

    const addOwnershipButton = screen.getByRole('button', {
      name: 'Add owner',
    });

    expect(addOwnershipButton).toBeInTheDocument();
  });

  it('add ownership button should be disabled if !isCurrentUserPrimaryOwner', () => {
    render(<TestControls isCurrentUserPrimaryOwner={false} />);

    const addOwnershipButton = screen.getByRole('button', {
      name: 'Add owner',
    });

    expect(addOwnershipButton).toBeDisabled();
  });

  it('should render a car ownership add form', () => {
    render(<TestControls />);

    const carOwnershipAddForm = screen.getByTestId(
      CAR_OWNERSHIP_ADD_FORM_TEST_ID,
    );

    expect(carOwnershipAddForm).toBeInTheDocument();
  });
});
