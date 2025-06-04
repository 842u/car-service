import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';
import { CarContext } from '@/context/CarContext';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { MOCK_CAR } from '@/utils/jest/mocks/general';
import { handleCarFormSubmit } from '@/utils/supabase/tables/cars';

import { CarEditForm } from './CarEditForm';

const MOCK_CAR_FORM_DATA: CarFormValues = {
  additionalFuelType: null,
  brand: null,
  driveType: null,
  engineCapacity: null,
  fuelType: null,
  insuranceExpiration: null,
  licensePlates: null,
  mileage: null,
  model: null,
  name: '',
  productionYear: null,
  technicalInspectionExpiration: null,
  transmissionType: null,
  vin: null,
  image: null,
};

jest.mock('@/utils/supabase/tables/cars.ts', () => ({
  handleCarFormSubmit: jest.fn(async () =>
    Promise.resolve({ data: { id: MOCK_CAR.id }, error: null }),
  ),
}));

jest.mock('@/utils/tanstack/cars.ts', () => ({
  carsUpdateOnMutate: jest.fn(),
}));

function TestCarEditForm() {
  return (
    <TanStackQueryProvider>
      <CarContext value={MOCK_CAR}>
        <CarEditForm />
      </CarContext>
    </TanStackQueryProvider>
  );
}

describe('CarEditForm', () => {
  it('should call proper submit handler on submit', async () => {
    const validInputText = 'validInputText';
    MOCK_CAR_FORM_DATA.name = validInputText;
    const user = userEvent.setup();
    render(<TestCarEditForm />);

    const submitButton = screen.getByRole('button', { name: 'Save' });
    const requiredNameInput = screen.getByRole('textbox', {
      name: /name/i,
    }) as HTMLInputElement;

    await user.clear(requiredNameInput);
    await user.type(requiredNameInput, validInputText);
    await user.click(submitButton);

    expect(handleCarFormSubmit).toHaveBeenCalledWith(
      MOCK_CAR_FORM_DATA,
      MOCK_CAR.id,
      'PATCH',
    );
  });
});
