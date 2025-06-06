import { Button } from '../../shared/base/Button/Button';
import { Form } from '../../shared/base/Form/Form';
import { useCarPrimaryOwnershipGrantForm } from './useCarPrimaryOwnershipGrantForm';

export const CAR_PRIMARY_OWNERSHIP_GRANT_FORM_TEST_ID =
  'car primary ownership grant form test id';

export type CarPrimaryOwnershipGrantFormProps = {
  carId: string;
  onSubmit?: () => void;
};

export function CarPrimaryOwnershipGrantForm({
  carId,
  onSubmit,
}: CarPrimaryOwnershipGrantFormProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    register,
    errors,
    isDirty,
    isSubmitting,
    isValid,
  } = useCarPrimaryOwnershipGrantForm({ carId, onSubmit });

  return (
    <Form
      className="gap-4"
      data-testid={CAR_PRIMARY_OWNERSHIP_GRANT_FORM_TEST_ID}
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
        <p className="text-warning-500 dark:text-warning-300">
          Granting primary ownership to someone else will revoke your current
          primary ownership status and the privileges that come with it.
        </p>
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
