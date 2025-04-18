import { Form } from '../Form/Form';
import { Button } from '../shared/base/Button/Button';
import { useGrantPrimaryOwnershipForm } from './useGrantPrimaryOwnershipForm';

export type GrantCarPrimaryOwnershipFormProps = {
  carId: string;
  onSubmit?: () => void;
};

export function GrantCarPrimaryOwnershipForm({
  carId,
  onSubmit,
}: GrantCarPrimaryOwnershipFormProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    register,
    errors,
    isDirty,
    isSubmitting,
    isValid,
  } = useGrantPrimaryOwnershipForm({ carId, onSubmit });

  return (
    <Form className="gap-4" variant="raw" onSubmit={handleFormSubmit}>
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
