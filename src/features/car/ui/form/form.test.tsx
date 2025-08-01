import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AriaRole } from 'react';

import type { CarFormValues } from '@/schemas/zod/carFormSchema';
import { FORM_IMAGE_INPUT_TEST_ID } from '@/ui/form/compounds/input-image/image-input';

import { CarForm } from './form';

const CAR_FORM_VALUES_MAP: {
  [K in keyof CarFormValues]: {
    label?: string | RegExp;
    inputRole?: AriaRole;
    testId?: string;
  };
} = {
  image: {
    label: 'Image',
    testId: FORM_IMAGE_INPUT_TEST_ID,
  },
  additional_fuel_type: {
    label: 'Additional Fuel Type',
    inputRole: 'combobox',
  },
  brand: {
    label: 'Brand',
    inputRole: 'textbox',
  },
  drive_type: {
    label: 'Drive Type',
    inputRole: 'combobox',
  },
  engine_capacity: {
    label: /engine capacity/i,
    inputRole: 'spinbutton',
  },
  fuel_type: {
    label: 'Fuel Type',
    inputRole: 'combobox',
  },
  license_plates: {
    label: 'License Plates',
    inputRole: 'textbox',
  },
  mileage: {
    label: /mileage/i,
    inputRole: 'spinbutton',
  },
  model: {
    label: 'Model',
    inputRole: 'textbox',
  },
  custom_name: {
    label: /name/i,
    inputRole: 'textbox',
  },
  production_year: {
    label: 'Production Year',
    inputRole: 'spinbutton',
  },
  transmission_type: {
    label: 'Transmission Type',
    inputRole: 'combobox',
  },
  vin: {
    label: 'VIN',
    inputRole: 'textbox',
  },
  insurance_expiration: {
    label: 'Insurance Expiration Date',
  },
  technical_inspection_expiration: {
    label: 'Technical Inspection Expiration Date',
  },
};

describe('CarForm', () => {
  it('should render as a form element', () => {
    const testAriaLabel = 'testAriaLabel';
    render(<CarForm aria-label={testAriaLabel} />);

    const formElement = screen.getByRole('form', { name: testAriaLabel });

    expect(formElement).toBeInTheDocument();
  });

  it('should render all car form values', () => {
    render(<CarForm />);

    for (const formField in CAR_FORM_VALUES_MAP) {
      const key = formField as keyof typeof CAR_FORM_VALUES_MAP;

      if (CAR_FORM_VALUES_MAP[key]?.inputRole) {
        const formFieldElement = screen.getByRole(
          CAR_FORM_VALUES_MAP[key].inputRole,
          { name: CAR_FORM_VALUES_MAP[key].label },
        );

        expect(formFieldElement).toBeInTheDocument();
      } else if (CAR_FORM_VALUES_MAP[key]?.testId) {
        const formFieldElement = screen.getByTestId(
          CAR_FORM_VALUES_MAP[key].testId,
        );

        expect(formFieldElement).toBeInTheDocument();
      } else {
        const formFieldElement = screen.getByLabelText(
          CAR_FORM_VALUES_MAP[key]?.label || '',
        );

        expect(formFieldElement).toBeInTheDocument();
      }
    }
  });

  it('should render form controls', () => {
    render(<CarForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(resetButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('form controls should be initially disabled', () => {
    render(<CarForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(resetButton).toBeDisabled();
    expect(saveButton).toBeDisabled();
  });

  it('reset button should be enabled on input change', async () => {
    const user = userEvent.setup();
    render(<CarForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const nameInput = screen.getByRole(
      CAR_FORM_VALUES_MAP.custom_name.inputRole || '',
      { name: CAR_FORM_VALUES_MAP.custom_name.label },
    );

    expect(resetButton).toBeDisabled();

    await user.type(nameInput, 'a');

    expect(resetButton).toBeEnabled();
  });

  it('form should reset on reset button click', async () => {
    const nameInputText = 'a';
    const user = userEvent.setup();
    render(<CarForm />);

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    const nameInput = screen.getByRole(
      CAR_FORM_VALUES_MAP.custom_name.inputRole || '',
      { name: CAR_FORM_VALUES_MAP.custom_name.label },
    );

    await user.type(nameInput, nameInputText);

    expect(nameInput).toHaveValue(nameInputText);

    await user.click(resetButton);

    expect(nameInput).toHaveValue('');
  });
});
