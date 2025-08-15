import { Button } from '@/ui/button/button';
import { Form } from '@/ui/form/form';

import { useAddForm } from './use-add';

export const ADD_FORM_TEST_ID = 'add-form';

export type AddFormProps = {
  carId: string;
  onSubmit?: () => void;
};

export function AddForm({ carId, onSubmit }: AddFormProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    errors,
    register,
    isDirty,
    isValid,
    isSubmitting,
  } = useAddForm({ carId, onSubmit });

  return (
    <Form
      className="gap-4"
      data-testid={ADD_FORM_TEST_ID}
      variant="raw"
      onSubmit={handleFormSubmit}
    >
      <Form.InputWrapper>
        <Form.Input
          required
          errorMessage={errors.userId?.message}
          label="User ID"
          maxLength={36}
          minLength={36}
          name="userId"
          register={register}
          type="text"
        />
      </Form.InputWrapper>
      <Form.Controls>
        <Button disabled={!isDirty} onClick={handleFormReset}>
          Reset
        </Button>
        <Form.ButtonSubmit
          disabled={!isValid || isSubmitting}
          isSubmitting={isSubmitting}
        >
          Save
        </Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
