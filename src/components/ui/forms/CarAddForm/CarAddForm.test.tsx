import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/features/common/providers/TanStackQueryProvider';
import { ToastsProvider } from '@/features/common/providers/ToastsProvider';
import { CarFormValues } from '@/schemas/zod/carFormSchema';
import { handleCarFormSubmit } from '@/utils/supabase/tables/cars';

import { CarAddForm } from './CarAddForm';

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
    MOCK_CAR_FORM_DATA.custom_name = validInputText;
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
