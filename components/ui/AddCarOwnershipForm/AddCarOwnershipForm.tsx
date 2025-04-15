import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { SubmitButton } from '../SubmitButton/SubmitButton';
import { useAddCarOwnershipForm } from './useAddCarOwnershipForm';

export type AddCarOwnershipFormProps = {
  carId: string;
  onSubmit?: () => void;
};

export function AddCarOwnershipForm({
  carId,
  onSubmit,
}: AddCarOwnershipFormProps) {
  const {
    handleFormSubmit,
    handleFormReset,
    errors,
    register,
    isDirty,
    isValid,
    isSubmitting,
  } = useAddCarOwnershipForm({ carId, onSubmit });

  return (
    <form
      className="border-accent-200 dark:border-accent-300 bg-light-500 dark:bg-dark-500 rounded-xl border-2 p-10"
      onSubmit={handleFormSubmit}
    >
      <h2>Add new car owner</h2>
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
