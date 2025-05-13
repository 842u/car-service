import { Form } from '../../shared/base/Form/Form';
import { useCarDeleteForm } from './useCarDeleteForm';

export const CAR_DELETE_FORM_TEST_ID = 'car delete form test id';

export type CarDeleteFormProps = {
  carId: string;
  onSubmit: () => void;
};

export function CarDeleteForm({ carId, onSubmit }: CarDeleteFormProps) {
  const { handleFormSubmit } = useCarDeleteForm({ carId, onSubmit });

  return (
    <Form
      className="gap-4"
      data-testid={CAR_DELETE_FORM_TEST_ID}
      variant="raw"
      onSubmit={handleFormSubmit}
    >
      <p className="text-warning-500 dark:text-warning-300">
        Are you sure you want permanently delete this car?
      </p>
      <Form.Controls>
        <Form.ButtonSubmit>Delete</Form.ButtonSubmit>
      </Form.Controls>
    </Form>
  );
}
