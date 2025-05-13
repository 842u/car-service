import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';

import { CAR_OWNERSHIP_ADD_FORM_TEST_ID } from '../../forms/CarOwnershipAddForm/CarOwnershipAddForm';
import { CAR_OWNERSHIP_DELETE_FORM_TEST_ID } from '../../forms/CarOwnershipDeleteForm/CarOwnershipDeleteForm';
import { CAR_PRIMARY_OWNERSHIP_GRANT_FORM_TEST_ID } from '../../forms/CarPrimaryOwnershipGrantForm/CarPrimaryOwnershipGrantForm';
import { defaultCarOwnershipFormValues } from './CarOwnershipSection';
import { CarOwnershipSectionControls } from './CarOwnershipSectionControls';

const MOCK_CAR_ID = 'ee4a8fa7-758e-4302-8726-01eeecee8707';
const MOCK_USER_ID = '90902611-dbe5-4575-b41f-4b4fa799ac92';

function TestOwnershipSectionControls({
  isCurrentUserPrimaryOwner = true,
}: {
  isCurrentUserPrimaryOwner?: boolean;
}) {
  const removeCarOwnershipFormMethods = useForm({
    mode: 'onChange',
    defaultValues: defaultCarOwnershipFormValues,
  });

  return (
    <>
      <label
        className="absolute top-0 left-0 flex h-full w-full justify-center"
        htmlFor={MOCK_USER_ID}
      >
        <input
          className="accent-accent-500"
          id={MOCK_USER_ID}
          type="checkbox"
          value={MOCK_USER_ID}
          {...removeCarOwnershipFormMethods.register('ownersIds')}
        />
        <span className="sr-only">select user</span>
      </label>
      <TanStackQueryProvider>
        <CarOwnershipSectionControls
          carId={MOCK_CAR_ID}
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
          removeCarOwnershipFormMethods={removeCarOwnershipFormMethods}
        />
      </TanStackQueryProvider>
    </>
  );
}

describe('CarOwnershipSectionControls', () => {
  it('should render a button for primary ownership granting', () => {
    render(<TestOwnershipSectionControls />);

    const primaryOwnershipButton = screen.getByRole('button', {
      name: 'grant primary ownership',
    });

    expect(primaryOwnershipButton).toBeInTheDocument();
  });

  it('primary ownership button should be disabled if !isCurrentUserPrimaryOwner', () => {
    render(<TestOwnershipSectionControls isCurrentUserPrimaryOwner={false} />);

    const primaryOwnershipButton = screen.getByRole('button', {
      name: 'grant primary ownership',
    });

    expect(primaryOwnershipButton).toBeDisabled();
  });

  it('should render a car primary ownership grant form', () => {
    render(<TestOwnershipSectionControls />);

    const carPrimaryOwnershipGrantForm = screen.getByTestId(
      CAR_PRIMARY_OWNERSHIP_GRANT_FORM_TEST_ID,
    );

    expect(carPrimaryOwnershipGrantForm).toBeInTheDocument();
  });

  it('should render a button for removing ownership', () => {
    render(<TestOwnershipSectionControls />);

    const removeOwnershipButton = screen.getByRole('button', {
      name: 'remove ownerships',
    });

    expect(removeOwnershipButton).toBeInTheDocument();
  });

  it('remove ownership button should be enabled after user was selected', async () => {
    const user = userEvent.setup();
    render(<TestOwnershipSectionControls />);

    const removeOwnershipButton = screen.getByRole('button', {
      name: 'remove ownerships',
    });
    const testOwnershipCheckbox = screen.getByRole('checkbox', {
      name: 'select user',
    });

    expect(removeOwnershipButton).toBeDisabled();

    await user.click(testOwnershipCheckbox);

    expect(removeOwnershipButton).toBeEnabled();
  });

  it('should render a car ownership delete form', () => {
    render(<TestOwnershipSectionControls />);

    const carOwnershipDeleteForm = screen.getByTestId(
      CAR_OWNERSHIP_DELETE_FORM_TEST_ID,
    );

    expect(carOwnershipDeleteForm).toBeInTheDocument();
  });

  it('should render a button for adding ownership', () => {
    render(<TestOwnershipSectionControls />);

    const addOwnershipButton = screen.getByRole('button', {
      name: 'add ownership',
    });

    expect(addOwnershipButton).toBeInTheDocument();
  });

  it('add ownership button should be disabled if !isCurrentUserPrimaryOwner', () => {
    render(<TestOwnershipSectionControls isCurrentUserPrimaryOwner={false} />);

    const addOwnershipButton = screen.getByRole('button', {
      name: 'add ownership',
    });

    expect(addOwnershipButton).toBeDisabled();
  });

  it('should render a car ownership add form', () => {
    render(<TestOwnershipSectionControls />);

    const carOwnershipAddForm = screen.getByTestId(
      CAR_OWNERSHIP_ADD_FORM_TEST_ID,
    );

    expect(carOwnershipAddForm).toBeInTheDocument();
  });
});
