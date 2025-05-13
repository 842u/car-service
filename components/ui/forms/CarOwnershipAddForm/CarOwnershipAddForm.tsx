import { Button } from '../../shared/base/Button/Button';
import { Form } from '../../shared/base/Form/Form';
import { useCarOwnershipAddForm } from './useCarOwnershipAddForm';

export const CAR_OWNERSHIP_ADD_FORM_TEST_ID = 'car ownership add form test id';

export type CarOwnershipAddFormProps = {
  carId: string;
  onSubmit?: () => void;
};

export function CarOwnershipAddForm({
  carId,
  onSubmit,
}: CarOwnershipAddFormProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    errors,
    register,
    isDirty,
    isValid,
    isSubmitting,
  } = useCarOwnershipAddForm({ carId, onSubmit });

  return (
    <Form
      className="gap-4"
      data-testid={CAR_OWNERSHIP_ADD_FORM_TEST_ID}
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
