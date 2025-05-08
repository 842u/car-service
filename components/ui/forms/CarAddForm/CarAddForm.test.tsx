import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/components/providers/TanStackQueryProvider';
import { ToastsProvider } from '@/components/providers/ToastsProvider';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { handleCarFormSubmit } from '@/utils/supabase/tables/cars';

import { CarAddForm } from './CarAddForm';

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
    Promise.resolve({ data: { id: '1' }, error: null }),
  ),
}));

function TestCarAddForm() {
  return (
    <TanStackQueryProvider>
      <ToastsProvider>
        <CarAddForm />
      </ToastsProvider>
    </TanStackQueryProvider>
  );
}

describe('CarAddForm', () => {
  it('should call proper submit handler on submit', async () => {
    const validInputText = 'validInputText';
    MOCK_CAR_FORM_DATA.name = validInputText;
    const user = userEvent.setup();
    render(<TestCarAddForm />);

    const submitButton = screen.getByRole('button', { name: 'Save' });
    const requiredNameInput = screen.getByRole('textbox', {
      name: /name/i,
    }) as HTMLInputElement;

    await user.type(requiredNameInput, validInputText);
    await user.click(submitButton);

    expect(handleCarFormSubmit).toHaveBeenCalledWith(
      MOCK_CAR_FORM_DATA,
      null,
      'POST',
    );
  });
});
