import { render, screen } from '@testing-library/react';

import { TanStackQueryProvider } from '@/features/common/providers/tan-stack-query';

import { CAR_OWNERSHIP_ADD_FORM_TEST_ID } from '../../CarOwnershipAddForm/CarOwnershipAddForm';
import { CarOwnershipsSectionControls } from './CarOwnershipsSectionControls';

const MOCK_CAR_ID = 'ee4a8fa7-758e-4302-8726-01eeecee8707';

function TestOwnershipsSectionControls({
  isCurrentUserPrimaryOwner = true,
}: {
  isCurrentUserPrimaryOwner?: boolean;
}) {
  return (
    <TanStackQueryProvider>
      <CarOwnershipsSectionControls
        carId={MOCK_CAR_ID}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </TanStackQueryProvider>
  );
}

describe('CarOwnershipsSectionControls', () => {
  it('should render a button for adding ownership', () => {
    render(<TestOwnershipsSectionControls />);

    const addOwnershipButton = screen.getByRole('button', {
      name: 'Add owner',
    });

    expect(addOwnershipButton).toBeInTheDocument();
  });

  it('add ownership button should be disabled if !isCurrentUserPrimaryOwner', () => {
    render(<TestOwnershipsSectionControls isCurrentUserPrimaryOwner={false} />);

    const addOwnershipButton = screen.getByRole('button', {
      name: 'Add owner',
    });

    expect(addOwnershipButton).toBeDisabled();
  });

  it('should render a car ownership add form', () => {
    render(<TestOwnershipsSectionControls />);

    const carOwnershipAddForm = screen.getByTestId(
      CAR_OWNERSHIP_ADD_FORM_TEST_ID,
    );

    expect(carOwnershipAddForm).toBeInTheDocument();
  });
});
