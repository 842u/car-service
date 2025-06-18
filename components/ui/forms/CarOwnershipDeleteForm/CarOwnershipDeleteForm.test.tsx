import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';

import { defaultCarOwnershipsFormValues } from '../../sections/CarOwnershipsSection/CarOwnershipsSection';
import {
  CarOwnershipDeleteForm,
  CarOwnershipDeleteFormProps,
  CarOwnershipDeleteFormValues,
} from './CarOwnershipDeleteForm';

const MOCK_CAR_ID = 'e63b96e8-8643-4084-915f-2e0421dd68e5';

function TestCarOwnershipDeleteForm({
  isCurrentUserPrimaryOwner = true,
  carId = MOCK_CAR_ID,
  ...props
}: Partial<CarOwnershipDeleteFormProps>) {
  const removeCarOwnershipFormMethods = useForm({
    mode: 'onChange',
    defaultValues: defaultCarOwnershipsFormValues,
  });

  return (
    <TanStackQueryProvider>
      <FormProvider<CarOwnershipDeleteFormValues>
        {...removeCarOwnershipFormMethods}
      >
        <CarOwnershipDeleteForm
          {...props}
          ref={null}
          carId={carId}
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        />
      </FormProvider>
    </TanStackQueryProvider>
  );
}

describe('CarOwnershipDeleteForm', () => {
  it('should render ownership deletion confirmation info', () => {
    render(<TestCarOwnershipDeleteForm />);

    const deletionConfirmationInfo = screen.getByText(/are you sure/i);

    expect(deletionConfirmationInfo).toBeInTheDocument();
  });

  it('should render additional ownership deletion confirmation info if removing self from the ownership list', () => {
    render(<TestCarOwnershipDeleteForm isCurrentUserPrimaryOwner={false} />);

    const deletionConfirmationInfo = screen.getByText(
      /you are trying to remove your ownership/i,
    );

    expect(deletionConfirmationInfo).toBeInTheDocument();
  });

  it('should render form reset button', () => {
    render(<TestCarOwnershipDeleteForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });

    expect(resetButton).toBeInTheDocument();
  });

  it('should render form submit button', () => {
    render(<TestCarOwnershipDeleteForm />);

    const submitButton = screen.getByRole('button', { name: 'Save' });

    expect(submitButton).toBeInTheDocument();
  });
});
