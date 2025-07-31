import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TanStackQueryProvider } from '@/common/providers/tan-stack-query';
import { ToastsProvider } from '@/common/providers/toasts/toasts';
import type { CarFormValues } from '@/schemas/zod/carFormSchema';
import { handleCarFormSubmit } from '@/utils/supabase/tables/cars';

import { AddForm } from './add';

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

function TestAddForm() {
  return (
    <TanStackQueryProvider>
      <ToastsProvider>
        <AddForm />
      </ToastsProvider>
    </TanStackQueryProvider>
  );
}

describe('AddForm', () => {
  it('should call proper submit handler on submit', async () => {
    const validInputText = 'validInputText';
    MOCK_CAR_FORM_DATA.custom_name = validInputText;
    const user = userEvent.setup();
    render(<TestAddForm />);

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
