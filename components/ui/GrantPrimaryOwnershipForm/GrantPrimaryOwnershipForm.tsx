import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';
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
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10 md:max-w-lg"
      onSubmit={handleFormSubmit}
    >
      <h2>Grant primary ownership</h2>
      <div className="bg-alpha-grey-200 my-4 h-[1px] w-full" />
      <Input
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
      <div className="mt-5 flex justify-end gap-5">
        <Button disabled={!isDirty} onClick={handleFormReset}>
          Reset
        </Button>
        <SubmitButton
          disabled={!isValid || isSubmitting}
          isSubmitting={isSubmitting}
        >
          Save
        </SubmitButton>
      </div>
    </form>
  );
}
