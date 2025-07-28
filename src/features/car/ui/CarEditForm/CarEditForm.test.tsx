import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/features/common/providers/tan-stack-query';
import { ToastsProvider } from '@/features/common/providers/toasts/toasts';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { Car } from '@/types';
import { handleCarFormSubmit } from '@/utils/supabase/tables/cars';

import { CarEditForm } from './CarEditForm';

const MOCK_CAR_ID = 'id';
const MOCK_CAR_DATABASE_DATA: Car = {
  created_at: null,
  created_by: null,
  id: MOCK_CAR_ID,
  additional_fuel_type: null,
  brand: null,
  drive_type: null,
  engine_capacity: null,
  fuel_type: null,
  insurance_expiration: null,
  license_plates: null,
  mileage: null,
  model: null,
  custom_name: 'testName',
  production_year: null,
  technical_inspection_expiration: null,
  transmission_type: null,
  vin: null,
  image_url: null,
};
const MOCK_CAR_FORM_DATA: CarFormValues = {
  additional_fuel_type: null,
  brand: null,
  drive_type: null,
  engine_capacity: null,
  fuel_type: null,
  insurance_expiration: null,
  license_plates: null,
  mileage: null,
  model: null,
  custom_name: '',
  production_year: null,
  technical_inspection_expiration: null,
  transmission_type: null,
  vin: null,
  image: null,
};

jest.mock('@/utils/supabase/tables/cars.ts', () => ({
  handleCarFormSubmit: jest.fn(async () =>
    Promise.resolve({ data: { id: MOCK_CAR_ID }, error: null }),
  ),
}));

jest.mock('@/utils/tanstack/cars.ts', () => ({
  carsUpdateOnMutate: jest.fn(),
}));

function TestCarEditForm() {
  return (
    <TanStackQueryProvider>
      <ToastsProvider>
        <CarEditForm carData={MOCK_CAR_DATABASE_DATA} />
      </ToastsProvider>
    </TanStackQueryProvider>
  );
}

describe('CarEditForm', () => {
  it('should call proper submit handler on submit', async () => {
    const validInputText = 'validInputText';
    MOCK_CAR_FORM_DATA.custom_name = validInputText;
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
      MOCK_CAR_ID,
      'PATCH',
    );
  });
});
